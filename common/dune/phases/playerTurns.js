const deckEngine = require('../systems/deckEngine.js')
const factions = require('../systems/factions.js')
const spies = require('../systems/spies.js')
const deploy = require('../systems/deploy.js')
const leaderAbilities = require('../systems/leaderAbilities.js')
const constants = require('../res/constants.js')
const { applyNukeRefresh } = require('../systems/imperiumRowRefresh.js')

/**
 * Build a structured choice option for a board space. The engine provides
 * `actions.cardOption` / `actions.playerOption`; spaces are Dune-specific so
 * the helper stays local.
 */
function spaceOption(space) {
  return { title: space.name, id: space.id, kind: 'board-space' }
}

/**
 * Phase 2: Player Turns
 * Players take turns clockwise. On each turn, a player takes either an Agent Turn
 * or a Reveal Turn. Once all players have taken a Reveal Turn, the phase ends.
 */
function playerTurnsPhase(game) {
  game.state.phase = 'player-turns'
  game.log.add({ template: 'Player Turns', event: 'phase-start' })

  // Reset turn state
  for (const player of game.players.all()) {
    player.setCounter('hasRevealed', 0, { silent: true })
    player.setCounter('agentsPlaced', 0, { silent: true })
    player.setCounter('persuasion', 0, { silent: true })
  }

  const allPlayers = game.players.all()
  const playerCount = allPlayers.length

  while (allPlayers.filter(p => p.getCounter('hasRevealed') > 0).length < playerCount) {
    for (let i = 0; i < playerCount; i++) {
      const playerIndex = (game.state.firstPlayerIndex + i) % playerCount
      const player = allPlayers[playerIndex]

      if (player.getCounter('hasRevealed') > 0) {
        continue
      }

      // Choose color on first turn of round 1
      if (game.state.round === 1) {
        game.chooseColor(player)
      }

      game.state.currentTurnPlayer = player.name

      game.log.add({
        template: `${player.name}'s Turn`,
        event: 'turn-start',
        args: { player },
      })

      // Initialize per-turn tracking state up front so Plot Intrigue at
      // start of turn reads sensible defaults (recalledSpy: false, etc.).
      // The acquire-placement flags (acquireToHand / acquireToTopOfDeck) are
      // set by plot intrigues played during the same turn as the Reveal and
      // consumed in acquireCardsPhase that same turn, so they reset cleanly
      // here. Agent-turn acquisition (Price Is No Object) resolves inline
      // during the Agent Turn and needs no cross-turn bridging.
      game.state.turnTracking = {
        recalledSpy: false,
        completedContract: false,
        spiceGained: 0,
        sentToMakerSpace: false,
        sentToFactionSpace: false,
        spaceIcon: null,
        agentSpaceId: null,
        garrisonAtTurnStart: player.troopsInGarrison,
        acquireToHand: false,
        acquireToTopOfDeck: false,
        unitsDeployedThisTurn: 0,
        distractionArmed: false,
        distractionFired: false,
      }

      // Plot Intrigue may only be played at the start or end of the player's
      // turn, never mid-action. Offer it here, before the player commits to
      // an Agent Turn card or to a Reveal Turn.
      offerPlotIntrigue(game, player)

      // Bindu Suspension: drew a card during plot phase; now offer to pass turn
      if (game.state.turnTracking?.binduSuspension) {
        game.state.turnTracking.binduSuspension = false
        const [passChoice] = game.actions.choose(player, [
          game.actions.option({ id: 'continue', title: 'Continue Turn' }),
          game.actions.option({ id: 'pass', title: 'Pass Turn' }),
        ], { title: 'Bindu Suspension: Pass your turn?' })
        const passId = typeof passChoice === 'object' ? passChoice.id : passChoice
        if (passId === 'pass' || passChoice === 'Pass Turn') {
          game.log.add({ template: '{player} passes their turn (Bindu Suspension)', args: { player } })
          continue
        }
      }

      // Build playable card list after Plot Intrigue offers. A card is
      // playable only if there exists at least one board space the player
      // could actually send an agent to with it — otherwise the player
      // would commit to the card and waste the turn with "no valid spaces".
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      let playableCards

      if (player.availableAgents > 0) {
        playableCards = handCards.filter(c => hasAgentTurnAccess(c) && hasValidPlacement(game, player, c))
      }
      else {
        // Cards that relocate an existing agent (e.g. Kwisatz Haderach) can still
        // be played when all agent slots are occupied, as long as there is an
        // agent already on the board to serve as the source of the move.
        const hasAgentOnBoard = Object.values(game.state.boardSpaces)
          .some(occupants => (occupants || []).includes(player.name))
        playableCards = hasAgentOnBoard
          ? handCards.filter(c =>
            c.definition?.movesExistingAgent && hasAgentTurnAccess(c) && hasValidPlacement(game, player, c)
          )
          : []
      }

      if (player.availableAgents > 0 || playableCards.length > 0) {
        const choices = []
        if (playableCards.length > 0) {
          choices.push({
            title: 'Agent Turn',
            choices: playableCards.map(c => game.actions.cardOption(c, 'imperium-card')),
          })
        }
        choices.push(game.actions.option({ id: 'reveal', title: 'Reveal Turn' }))

        const [choice] = game.actions.choose(player, choices, {
          title: 'Choose Turn',
        })

        if (choice.title === 'Agent Turn') {
          const sel = choice.selection[0]
          const selId = typeof sel === 'object' ? sel.id : null
          const selTitle = typeof sel === 'object' ? sel.title : sel
          const card = playableCards.find(c => c.id === selId)
            || playableCards.find(c => c.name === selTitle)
          agentTurn(game, player, card)
        }
        else {
          revealTurn(game, player)
        }
      }
      else {
        revealTurn(game, player)
      }
    }
  }
}

/**
 * Agent Turn: Play a card, send an agent to a board space, resolve effects.
 */
function agentTurn(game, player, card) {
  game.log.indent()

  // turnTracking is initialized by playerTurnsPhase; Plot Intrigue has
  // already been offered at the start of the turn, before the player
  // committed to this card.

  // Leader start-of-turn hook
  leaderAbilities.onAgentTurnStart(game, player)

  // Pre-placement card effect — flags that must apply to the card's own
  // placement (e.g. Undercover Asset's "ignore Influence requirements")
  // need to be set before canSendAgentTo runs.
  if (typeof card.definition?.prePlacementEffect === 'function') {
    card.definition.prePlacementEffect(game, player, card, { resolveEffect })
  }

  // Step 2: Choose a board space
  const boardSpaces = getBoardSpaces()
  const validSpaces = boardSpaces.filter(space => canSendAgentTo(game, player, card, space))

  if (validSpaces.length === 0) {
    game.log.add({ template: 'No valid board spaces', event: 'memo' })
    game.log.outdent()
    return
  }

  const spaceChoices = validSpaces.map(s => spaceOption(s))
  const [spaceChoice] = game.actions.choose(player, spaceChoices, {
    title: 'Choose a board space',
  })
  const spaceId = typeof spaceChoice === 'object' ? spaceChoice.id : null
  const spaceTitle = typeof spaceChoice === 'object' ? spaceChoice.title : spaceChoice
  const space = validSpaces.find(s => s.id === spaceId)
    || validSpaces.find(s => s.name === spaceTitle)

  // Spy actions before placing agent
  const spaceOccupied = (game.state.boardSpaces[space.id] || []).length > 0
  const hasSpyOnPost = spies.hasSpyAt(game, player, space.id)

  if (spaceOccupied && hasSpyOnPost) {
    // Must infiltrate — recall spy to ignore occupant
    spies.recallSpyAt(game, player, space.id)
    game.state.turnTracking.recalledSpy = true
    game.log.add({
      template: '{player} infiltrates {boardSpace} (ignoring occupant)',
      args: { player, boardSpace: space.name },
    })
  }
  else if (!spaceOccupied && hasSpyOnPost) {
    // Offer Gather Intelligence — recall spy to draw a card
    const giChoices = [
      game.actions.option({ id: 'no', title: 'No' }),
      game.actions.option({ id: 'yes', title: 'Yes — recall Spy to draw a card' }),
    ]
    const [giChoice] = game.actions.choose(player, giChoices, {
      title: 'Gather Intelligence?',
    })
    const giId = typeof giChoice === 'object' ? giChoice.id : giChoice
    if (giId !== 'no' && giChoice !== 'No') {
      spies.recallSpyAt(game, player, space.id)
      game.state.turnTracking.recalledSpy = true
      deckEngine.drawCards(game, player, 1)
      game.log.add({
        template: '{player} gathers intelligence at {boardSpace}',
        args: { player, boardSpace: space.name },
      })
    }
  }

  // Play the card and place the agent
  deckEngine.playCard(game, player, card)
  if (!game.state.boardSpaces[space.id]) {
    game.state.boardSpaces[space.id] = []
  }
  game.state.boardSpaces[space.id].push(player.name)
  player.incrementCounter('agentsPlaced', 1, { silent: true })

  game.log.add({
    template: '{player} sends Agent to {boardSpace}',
    args: { player, boardSpace: space.name },
    summary: true,
  })

  // Pay board space cost
  const cost = getSpaceCost(game, space, player)
  let paidSolari = false
  if (cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      if (amount > 0) {
        player.decrementCounter(resource, amount, { silent: true })
        game.log.add({
          template: '{player} pays {amount} {resource}',
          args: { player, amount, resource },
        })
        if (resource === 'solari') {
          paidSolari = true
        }
      }
    }
  }

  // Leader hook: Count Ilban Richese draws on paying Solari
  if (paidSolari) {
    leaderAbilities.onPaySolariForSpace(game, player)
  }

  // Track space type for conditional cards
  game.state.turnTracking.spaceIcon = space.icon
  game.state.turnTracking.agentSpaceId = space.id
  if (space.isMakerSpace) {
    game.state.turnTracking.sentToMakerSpace = true
  }
  if (space.faction) {
    game.state.turnTracking.sentToFactionSpace = true
  }

  // Gain faction influence if faction space
  if (space.faction) {
    const influenceAmount = game.state.turnTracking?.extraInfluence ? 2 : 1
    factions.gainInfluence(game, player, space.faction, influenceAmount)
    if (game.state.turnTracking?.extraInfluence) {
      game.state.turnTracking.extraInfluence = false
    }
  }

  // Resolve card agent ability and board space effects (player chooses order per rules)
  const hasCardAbility = !!card.definition?.agentAbility
  if (hasCardAbility) {
    const orderChoices = [game.actions.cardOption(card, 'imperium-card'), spaceOption(space)]
    const [order] = game.actions.choose(player, orderChoices, {
      title: 'Which effect to resolve first?',
    })
    const orderTitle = typeof order === 'object' ? order.title : order
    if (orderTitle === card.name) {
      resolveCardAgentAbility(game, player, card)
      resolveBoardSpaceEffects(game, player, space)
    }
    else {
      resolveBoardSpaceEffects(game, player, space)
      resolveCardAgentAbility(game, player, card)
    }
  }
  else {
    resolveBoardSpaceEffects(game, player, space)
  }

  // Lady Jessica / Reverend Mother: leader ability on BG/Fremen spaces
  leaderAbilities.onAgentPlaced(game, player, space, resolveBoardSpaceEffects)

  // Staban Tuek: opponents gain spice when you visit a maker space they're spying on
  if (space.isMakerSpace) {
    leaderAbilities.onOpponentVisitsMakerSpace(game, player, space)
  }

  // Resolve contract completion before deployment so troops gained from a
  // completed contract (e.g. Spice Refinery III) can be sent to the Conflict.
  const choam = require('../systems/choam.js')
  choam.checkContractCompletion(game, player, 'board-space', { spaceId: space.id })

  // Control bonus: when any player sends an agent to a controlled location
  const controlledBy = game.state.controlMarkers[space.id]
  if (controlledBy) {
    const controller = game.players.byName(controlledBy)
    if (space.controlBonus) {
      controller.incrementCounter(space.controlBonus.resource, space.controlBonus.amount, { silent: true })
      game.log.add({
        template: '{player} receives {amount} {resource} (control bonus)',
        args: { player: controller, amount: space.controlBonus.amount, resource: space.controlBonus.resource },
      })
    }
  }

  // Offer to play a Plot Intrigue card before deploying, so troops granted
  // by an end-of-turn intrigue card can still be sent to the Conflict
  offerPlotIntrigue(game, player)

  // Deploy units if combat space (or card made it a combat space) — this is
  // the last step of the turn so troops from any source this turn are deployable
  if (space.isCombatSpace || game.state.turnTracking?.spaceIsCombat) {
    deployUnits(game, player)
  }

  game.log.outdent()
}

/**
 * Reveal Turn: Reveal hand, resolve effects, set strength, acquire cards, clean up.
 */
function revealTurn(game, player) {
  game.log.add({
    template: 'Reveal',
    event: 'step',
  })
  game.log.indent()

  // Flags cards like Reinforcements that key off "your Reveal turn"
  game.state.turnTracking.isRevealTurn = true

  // Plot Intrigue already offered by playerTurnsPhase before the
  // turn-type choice.

  // Step 1: Reveal all remaining hand cards
  const revealedCards = deckEngine.revealHand(game, player)

  // Step 2: Log each card and resolve its reveal effects
  let totalPersuasion = 0
  const swordSources = []

  for (const card of revealedCards) {
    const cardPersuasion = card.revealPersuasion || 0
    const cardSwords = card.revealSwords || 0
    totalPersuasion += cardPersuasion
    if (cardSwords > 0) {
      swordSources.push({ label: card.name, swords: cardSwords })
    }

    game.log.add({
      template: '{player} reveals {card}',
      args: { player, card },
    })
    game.log.indent()

    if (cardPersuasion > 0) {
      game.log.add({
        template: '+{amount} Persuasion',
        args: { amount: cardPersuasion },
      })
    }
    if (cardSwords > 0) {
      game.log.add({
        template: '+{amount} Sword(s)',
        args: { amount: cardSwords },
      })
    }

    resolveCardRevealAbility(game, player, card, revealedCards)

    game.log.outdent()
  }

  // High Council seat: +2 Persuasion during Reveal
  if (player.hasHighCouncil) {
    const seatBonus = 2
    totalPersuasion += seatBonus
    game.log.add({
      template: '{player}: +{amount} Persuasion (High Council seat)',
      args: { player, amount: seatBonus },
    })
  }

  if (totalPersuasion > 0) {
    player.incrementCounter('persuasion', totalPersuasion, { silent: true })
  }

  // Leader reveal turn hook
  leaderAbilities.onRevealTurn(game, player)

  // Set combat strength
  const { setRevealStrength } = require('../systems/strengthBreakdown.js')
  const revealStr = setRevealStrength(game, player, swordSources)
  if (revealStr > 0) {
    game.log.add({
      template: '{player} sets strength to {strength}',
      args: { player, strength: revealStr },
    })
  }

  // Step 3: Acquire cards with persuasion
  acquireCardsPhase(game, player)

  // Offer Plot Intrigue at end of turn
  offerPlotIntrigue(game, player)

  // Step 4: Clean up
  deckEngine.cleanUp(game, player)
  player.setCounter('hasRevealed', 1, { silent: true })

  game.log.outdent()
}

/**
 * Acquire a single Imperium card, paying with Persuasion (default) or Solari.
 * Returns true if a card was acquired, false if the player passed or had no
 * affordable card. Handles reserved-card discounts, placement (discard /
 * hand / top of deck), troop-on-acquire, and per-card onAcquire side effects.
 *
 * `opts.useSolari` pays from Solari instead of Persuasion (Price is Not
 * Object's Agent ability). `opts.toHand` / `opts.toTopOfDeck` override the
 * default discard-pile placement; if neither is passed they fall back to the
 * current turn's placement flags so reveal-turn intrigues still apply.
 */
function acquireOneCard(game, player, opts = {}) {
  const useSolari = !!opts.useSolari
  const toTopOfDeck = opts.toTopOfDeck ?? !!game.state.turnTracking?.acquireToTopOfDeck
  const toHand = opts.toHand ?? !!game.state.turnTracking?.acquireToHand

  const nukeAvailable = game.settings.imperiumRowRefresh === 'nuke' &&
    !!game.state.nukesAvailable?.[player.name]

  const budget = useSolari ? player.solari : player.getCounter('persuasion')
  if (budget <= 0 && !nukeAvailable) {
    return false
  }

  const acquirableCards = budget > 0 ? getAcquirableCards(game, player, budget) : []
  if (acquirableCards.length === 0 && !nukeAvailable) {
    return false
  }

  const resource = useSolari ? 'Solari' : 'Persuasion'
  // Use chooseCards so name collisions (e.g. imperium + reserve cards
  // happening to share a title) resolve by card id rather than by
  // iteration order. Pass is represented as a sentinel entry so it
  // mixes cleanly into the card list.
  const passSentinel = { name: 'Pass', id: '__pass__' }
  const nukeSentinel = { name: 'Use Nuke', id: '__nuke__' }
  const extras = nukeAvailable ? [passSentinel, nukeSentinel] : [passSentinel]
  const [chosen] = game.actions.chooseCards(player, [...extras, ...acquirableCards], {
    title: `Acquire cards (${budget} ${resource} available)`,
    kind: 'imperium-card',
  })

  if (!chosen || chosen.id === '__pass__') {
    return false
  }

  if (chosen.id === '__nuke__') {
    applyNukeRefresh(game, player)
    return true
  }

  const card = chosen
  const effectiveCost = acquireCost(game, player, card)
  player.decrementCounter(useSolari ? 'solari' : 'persuasion', effectiveCost)

  // If this was a reserved card, clear that reservation entry
  if (isReservedFor(game, player, card)) {
    game.log.add({
      template: '{player}: acquires reserved {card} at -1 Persuasion (Manipulate)',
      args: { player, card },
    })
    game.state.reservedCards = game.state.reservedCards.filter(
      entry => !(entry.player === player.name && entry.cardId === card.id)
    )
  }

  // Acquire to top of deck, hand, or discard pile
  if (toTopOfDeck) {
    const deckZone = game.zones.byId(`${player.name}.deck`)
    card.moveTo(deckZone)
    game.log.add({ template: '{player} acquires {card} to top of deck', args: { player, card }, summary: true })
    deckEngine.refillImperiumRow(game)
    deckEngine.applyAcquireTroopBonus(game, player)
  }
  else if (toHand) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    card.moveTo(handZone)
    game.log.add({ template: '{player} acquires {card} to hand', args: { player, card }, summary: true })
    deckEngine.refillImperiumRow(game)
    deckEngine.applyAcquireTroopBonus(game, player)
  }
  else {
    deckEngine.acquireCard(game, player, card)
    deckEngine.applyAcquireTroopBonus(game, player)
  }

  // Per-card onAcquire hook lives on the card definition.
  if (typeof card.definition?.onAcquire === 'function') {
    card.definition.onAcquire(game, player, card, { resolveEffect })
  }

  // Guild Spy: if you acquire The Spice Must Flow this turn, gain +1
  // influence with each faction you are spying on.
  if (card.defId === 'the-spice-must-flow' && game.state.turnTracking?.guildSpyTSMF) {
    const spyMod = require('../systems/spies.js')
    const boardSpaces = getBoardSpaces()
    const connectedSpaceIds = spyMod.getSpyConnectedSpaces(game, player)
    const spiedFactions = new Set()
    for (const spaceId of connectedSpaceIds) {
      const space = boardSpaces.find(s => s.id === spaceId)
      if (space?.faction) {
        spiedFactions.add(space.faction)
      }
    }
    for (const faction of spiedFactions) {
      factions.gainInfluence(game, player, faction, 1)
    }
    game.state.turnTracking.guildSpyTSMF = false
  }

  return true
}

/**
 * Let player spend persuasion to acquire cards during their Reveal Turn.
 */
function acquireCardsPhase(game, player) {
  while (acquireOneCard(game, player)) {
    // keep offering acquisitions until the player passes or can't afford one
  }
}

/**
 * Get all cards the player can acquire given their current persuasion.
 */
function getAcquirableCards(game, player, persuasion) {
  const cards = []

  // Imperium Row
  const rowZone = game.zones.byId('common.imperiumRow')
  for (const card of rowZone.cardlist()) {
    if ((card.persuasionCost || 0) <= persuasion) {
      cards.push(card)
    }
  }

  // Reserve: Prepare the Way
  const ptwZone = game.zones.byId('common.reserve.prepareTheWay')
  const ptwCards = ptwZone.cardlist()
  if (ptwCards.length > 0 && (ptwCards[0].persuasionCost || 0) <= persuasion) {
    cards.push(ptwCards[0])
  }

  // Reserve: The Spice Must Flow
  const tsmfZone = game.zones.byId('common.reserve.spiceMustFlow')
  const tsmfCards = tsmfZone.cardlist()
  if (tsmfCards.length > 0 && (tsmfCards[0].persuasionCost || 0) <= persuasion) {
    cards.push(tsmfCards[0])
  }

  // Reserved cards (Helena signet, Manipulate plot): -1 persuasion for the
  // reserving player only. Multiple reservations can be active simultaneously.
  const reservedZone = game.zones.byId('common.reservedCards')
  for (const reserved of reservedZone.cardlist()) {
    if (!isReservedFor(game, player, reserved)) {
      continue
    }
    if (acquireCost(game, player, reserved) <= persuasion) {
      cards.push(reserved)
    }
  }

  return cards
}

/**
 * Effective persuasion cost for a card, after discounts.
 */
function acquireCost(game, player, card) {
  let cost = card.persuasionCost || 0
  if (isReservedFor(game, player, card)) {
    cost = Math.max(0, cost - 1)
  }
  return cost
}

function isReservedFor(game, player, card) {
  return game.state.reservedCards.some(
    entry => entry.player === player.name && entry.cardId === card.id
  )
}

/**
 * Whether a card has any way to be played for an Agent Turn at all
 * (matching icons, faction access, or spy access). A card lacking all
 * three (e.g. a pure reveal-only card) can never be played as an agent.
 */
function hasAgentTurnAccess(card) {
  return card.agentIcons.length > 0 || card.factionAccess.length > 0 || card.spyAccess
}

/**
 * Whether the player has at least one valid board space they could send
 * an agent to with this card given current game state (occupancy, costs,
 * influence requirements, spy connections, blocked spaces, etc.).
 *
 * For cards that move an existing agent (e.g. Kwisatz Haderach), the source
 * agent is removed before the destination is chosen, so we temporarily remove
 * each possible source to check whether a valid destination would exist.
 */
function hasValidPlacement(game, player, card) {
  const boardSpaces = getBoardSpaces()

  if (card.definition?.movesExistingAgent) {
    const playerOccupied = Object.entries(game.state.boardSpaces)
      .filter(([, occ]) => (occ || []).includes(player.name))

    if (playerOccupied.length === 0) {
      return boardSpaces.some(space => canSendAgentTo(game, player, card, space))
    }

    for (const [, occupants] of playerOccupied) {
      const idx = occupants.indexOf(player.name)
      occupants.splice(idx, 1)
      const hasValid = boardSpaces.some(space => canSendAgentTo(game, player, card, space))
      occupants.splice(idx, 0, player.name)
      if (hasValid) {
        return true
      }
    }
    return false
  }

  return boardSpaces.some(space => canSendAgentTo(game, player, card, space))
}

/**
 * Check if a player can send an agent to a board space with a given card.
 * A space is accessible if:
 *   1. Card has a matching agent icon or faction icon for the space, OR
 *   2. Card has spyAccess and player has a spy on a post connected to the space
 * A space is blocked if occupied, UNLESS the player can Infiltrate (recall a spy
 * on a connected post to ignore the occupant).
 */
function canSendAgentTo(game, player, card, space) {
  // Check icon access — allIcons/allFactionIcons from Resourceful/Dispatch an Envoy bypass this
  const allIcons = game.state.turnTracking?.allIcons
  const allFactionIcons = game.state.turnTracking?.allFactionIcons
  const hasMatchingIcon = allIcons || allFactionIcons
    || card.agentIcons.includes(space.icon) || card.factionAccess.includes(space.icon)
  const hasSpyConnection = card.spyAccess && spies.hasSpyAt(game, player, space.id)
  if (!hasMatchingIcon && !hasSpyConnection) {
    return false
  }

  // Space occupancy check — can infiltrate if spy on connected post, leader ignores, or card ignores
  if ((game.state.boardSpaces[space.id] || []).length > 0) {
    const cardIgnores = game.state.turnTracking?.ignoreOccupancy
    if (!spies.hasSpyAt(game, player, space.id) && !leaderAbilities.ignoresOccupancy(game, player, space) && !cardIgnores) {
      return false
    }
  }

  // Player must be able to pay the cost
  const canSendCost = getSpaceCost(game, space, player)
  if (canSendCost) {
    for (const [resource, amount] of Object.entries(canSendCost)) {
      if (player.getCounter(resource) < amount) {
        return false
      }
    }
  }

  // Swordmaster: can't visit if you already have one
  if (space.id === 'sword-master' && player.getCounter('hasSwordmaster') > 0) {
    return false
  }

  // Influence requirements (skipped by Undercover Asset / Insider Information)
  if (space.influenceRequirement && !game.state.turnTracking?.ignoreInfluenceRequirements) {
    const req = space.influenceRequirement
    if (player.getInfluence(req.faction) < req.amount) {
      return false
    }
  }

  // Blocked spaces (The Voice) — still allowed if you're already present there
  if (game.state.blockedSpaces?.includes(space.id) && !(game.state.boardSpaces[space.id] || []).includes(player.name)) {
    return false
  }

  return true
}

/**
 * Deploy units to the conflict from garrison + any recruited this turn.
 * Players may deploy up to 2 units from garrison plus any newly recruited.
 */
function deployUnits(game, player) {
  const garrisoned = player.troopsInGarrison
  if (garrisoned === 0) {
    return
  }

  // Shaddam Corrino IV's "Emperor of the Known Universe" locks deployment for
  // the rest of the turn.
  if (game.state.turnTracking?.shaddamNoDeploy) {
    return
  }

  // Per rules: deploy any/all troops recruited this turn + up to 2 from pre-existing garrison
  const garrisonAtStart = game.state.turnTracking?.garrisonAtTurnStart ?? garrisoned
  const recruited = Math.max(0, garrisoned - garrisonAtStart)
  const preExisting = garrisonAtStart
  const maxDeploy = Math.min(garrisoned, recruited + Math.min(2, preExisting))
  const choices = []
  for (let i = 0; i <= maxDeploy; i++) {
    choices.push(game.actions.option({ id: `deploy-${i}`, title: `Deploy ${i} troop(s) from garrison` }))
  }

  const [choice] = game.actions.choose(player, choices, {
    title: 'Deploy troops to the Conflict',
  })

  const choiceId = typeof choice === 'object' ? choice.id : null
  const count = choiceId
    ? parseInt(choiceId.replace('deploy-', ''))
    : parseInt(String(choice).match(/\d+/)[0])
  if (count > 0) {
    player.decrementCounter('troopsInGarrison', count, { silent: true })
    deploy.deployToConflict(game, player, count)
    game.log.add({
      template: '{player} deploys {count} troop(s) to the Conflict',
      args: { player, count },
    })

    // Desert Ambush: force enemy retreat per troop deployed
    if (game.state.turnTracking?.forceRetreatOnDeploy) {
      for (let i = 0; i < count; i++) {
        const opponents = game.players.all().filter(p =>
          p.name !== player.name && (game.state.conflict.deployedTroops[p.name] || 0) > 0
        )
        if (opponents.length > 0) {
          const targetChoices = [
            game.actions.option({ id: 'pass', title: 'Pass' }),
            ...opponents.map(p => game.actions.playerOption(p)),
          ]
          const [targetChoice] = game.actions.choose(player, targetChoices, {
            title: 'Force an enemy troop to retreat?',
          })
          const targetId = typeof targetChoice === 'object' ? targetChoice.id : targetChoice
          if (targetId !== 'pass' && targetChoice !== 'Pass') {
            const targetName = targetId
            game.state.conflict.deployedTroops[targetName]--
            const target = game.players.byName(targetName)
            target.incrementCounter('troopsInSupply', 1, { silent: true })
            game.log.add({
              template: '{player} forces {target} to retreat 1 troop',
              args: { player, target },
            })
          }
        }
      }
    }
  }
}

/**
 * Resolve board space effects.
 */
/**
 * Resolve a card's agent ability, if it has one and we can parse it.
 */
function resolveCardAgentAbility(game, player, card) {
  const abilityText = card.definition?.agentAbility
  if (!abilityText) {
    return
  }

  // Signet Ring triggers leader ability
  if (abilityText === 'Signet Ring') {
    const leaders = require('../systems/leaders.js')
    leaders.resolveSignetRing(game, player, resolveEffect)
    return
  }

  // Per-card agentEffect method lives on the card definition.
  if (typeof card.definition?.agentEffect === 'function') {
    card.definition.agentEffect(game, player, card, { resolveEffect, acquireCard: acquireOneCard })
    return
  }

  const effects = card.definition?.agentEffects
  if (!effects) {
    // Complex ability without a static effect array or explicit function — log it.
    game.log.add({
      template: 'Card ability: {ability}',
      args: { ability: abilityText },
      event: 'memo',
    })
    return
  }

  // Find the card object for trash-self (it's now in the played zone)
  for (const effect of effects) {
    if (effect.type === 'trash-self') {
      deckEngine.trashCard(game, card, player)
    }
    else if (effect.type === 'discard-card') {
      // Discard from hand
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const discardCard = game.actions.chooseCard(player, handCards, {
          title: 'Choose a card to discard',
          kind: 'imperium-card',
        })
        if (discardCard) {
          deckEngine.discardCard(game, player, discardCard)
          game.log.add({
            template: '{player} discards {card}',
            args: { player, card: discardCard },
          })
        }
      }
    }
    else {
      resolveEffect(game, player, effect, null, card?.name, card)
    }
  }
}

/**
 * Resolve a card's reveal ability.
 *
 * Bond abilities are encoded as `conditional` effects with a
 * `faction-card-in-play` condition; the runtime evaluates them generically
 * via `resolveEffect` → `checkCondition`.
 */
function resolveCardRevealAbility(game, player, card, allRevealedCards) {
  const abilityText = card.definition?.revealAbility
  if (!abilityText) {
    return
  }

  if (typeof card.definition?.revealEffect === 'function') {
    card.definition.revealEffect(game, player, card, allRevealedCards)
    return
  }

  const effects = card.definition?.revealEffects
  if (!effects) {
    game.log.add({
      template: 'Reveal ability: {ability}',
      args: { ability: abilityText },
      event: 'memo',
    })
    return
  }

  for (const effect of effects) {
    resolveEffect(game, player, effect, null, card.name, card)
  }
}

function resolveBoardSpaceEffects(game, player, space) {
  if (!space.effects) {
    return
  }

  for (const effect of space.effects) {
    resolveEffect(game, player, effect, space, space.name)
  }

  // Maker spaces always grant bonus spice (independent of harvest/worm choice)
  if (space.isMakerSpace) {
    const bonus = game.state.bonusSpice[space.id] || 0
    if (bonus > 0) {
      player.incrementCounter('spice', bonus, { silent: true })
      game.log.add({
        template: '{player} collects {amount} bonus Spice',
        args: { player, amount: bonus },
      })
      game.state.bonusSpice[space.id] = 0
      if (game.state.turnTracking) {
        game.state.turnTracking.spiceGained += bonus
      }
    }
    // Check harvest contract using total spice gained this turn
    if (game.state.turnTracking?.spiceGained > 0) {
      const choamHarvest = require('../systems/choam.js')
      choamHarvest.checkContractCompletion(game, player, 'harvest', { spiceAmount: game.state.turnTracking.spiceGained })
    }
  }
}

/**
 * Resolve a single effect. Used by board spaces, choice sub-effects, and combat rewards.
 */
function resolveEffect(game, player, effect, space, sourceName, card) {
  switch (effect.type) {
    case 'gain':
      player.incrementCounter(effect.resource, effect.amount, { silent: true })
      game.log.add({
        template: '{player} gains {amount} {resource}',
        args: { player, amount: effect.amount, resource: effect.resource },
      })
      if (effect.resource === 'spice' && game.state.turnTracking) {
        game.state.turnTracking.spiceGained += effect.amount
      }
      if (effect.resource === 'solari') {
        leaderAbilities.onGainSolari(game, player, effect.amount)
      }
      break

    case 'troop': {
      const recruit = Math.min(effect.amount, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        // Sardaukar Coordination: recruited troops go to conflict instead of garrison
        if (game.state.turnTracking?.recruitToConflict) {
          deploy.deployToConflict(game, player, recruit)
          game.log.add({
            template: '{player} recruits {amount} troop(s) to Conflict',
            args: { player, amount: recruit },
          })
        }
        else {
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          game.log.add({
            template: '{player} recruits {amount} troop(s)',
            args: { player, amount: recruit },
          })
        }
      }
      break
    }

    case 'intrigue':
      deckEngine.drawIntrigueCard(game, player, effect.amount)
      break

    case 'draw':
      deckEngine.drawCards(game, player, effect.amount)
      break

    case 'spy':
      for (let i = 0; i < (effect.amount || 1); i++) {
        if (!spies.placeSpy(game, player)) {
          break
        }
      }
      break

    case 'spice-harvest': {
      let base = effect.amount || 0
      if (base === 0) {
        break
      }
      // Double harvest from card effect
      if (game.state.turnTracking?.doubleHarvest) {
        base *= 2
        game.state.turnTracking.doubleHarvest = false
      }
      let total = leaderAbilities.modifyHarvestAmount(game, player, base)
      if (total > 0) {
        player.incrementCounter('spice', total, { silent: true })
        game.log.add({
          template: '{player} harvests {total} Spice',
          args: { player, total },
        })
        if (game.state.turnTracking) {
          game.state.turnTracking.spiceGained += total
        }
      }
      break
    }

    case 'choice': {
      // Filter choices the player can afford / qualifies for
      const available = effect.choices.filter(c => {
        if (c.cost) {
          for (const [resource, amount] of Object.entries(c.cost)) {
            if (player.getCounter(resource) < amount) {
              return false
            }
          }
        }
        if (c.requires === 'maker-hook') {
          if (!game.state.makerHooks?.[player.name]) {
            return false
          }
          if (isConflictProtected(game)) {
            return false
          }
        }
        return true
      })

      if (available.length === 0) {
        break
      }

      const labels = available.map((c, idx) => game.actions.option({
        id: c.id || `choice-${idx}`,
        title: c.label,
      }))
      const [selected] = game.actions.choose(player, labels, {
        title: 'Choose an option',
      })
      const selId = typeof selected === 'object' ? selected.id : null
      const selTitle = typeof selected === 'object' ? selected.title : selected
      const chosen = selId
        ? available.find((c, idx) => (c.id || `choice-${idx}`) === selId)
        : available.find(c => c.label === selTitle)

      // Pay choice cost
      if (chosen.cost) {
        let paidSolariInChoice = false
        for (const [resource, amount] of Object.entries(chosen.cost)) {
          player.decrementCounter(resource, amount, { silent: true })
          game.log.add({
            template: '{player} pays {amount} {resource}',
            args: { player, amount, resource },
          })
          if (resource === 'solari') {
            paidSolariInChoice = true
          }
        }
        if (paidSolariInChoice) {
          leaderAbilities.onPaySolariForSpace(game, player)
        }
      }

      // Resolve sub-effects
      for (const subEffect of chosen.effects) {
        resolveEffect(game, player, subEffect, space, sourceName, card)
      }
      break
    }

    case 'influence-choice': {
      const factionChoices = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [factionChoice] = game.actions.choose(player, factionChoices, {
        title: 'Choose a faction to gain Influence',
      })
      const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
      factions.gainInfluence(game, player, faction, effect.amount)
      break
    }

    case 'high-council':
      if (!player.hasHighCouncil) {
        player.setCounter('hasHighCouncil', 1, { silent: true })
        game.log.add({
          template: '{player} gains a seat on the High Council',
          args: { player },
        })
        leaderAbilities.onGainHighCouncil(game, player)
      }
      else {
        // Already seated: board-printed alternate payout.
        game.log.add({
          template: '{player} already has a High Council seat — takes the alternate payout',
          args: { player },
        })
        resolveEffect(game, player, { type: 'gain', resource: 'spice', amount: 2 }, space)
        resolveEffect(game, player, { type: 'intrigue', amount: 1 }, space)
        resolveEffect(game, player, { type: 'troop', amount: 3 }, space)
      }
      break

    case 'sword-master':
      if (!player.getCounter('hasSwordmaster')) {
        player.setCounter('hasSwordmaster', 1, { silent: true })
        game.log.add({
          template: '{player} gains a Swordmaster (3rd Agent)',
          args: { player },
        })
      }
      break

    case 'trash-card': {
      // Per official rules, "trash a card" allows a card from hand,
      // in play (Agent-played or Revealed), or discard pile.
      const trashCount = effect.amount || 1
      for (let ti = 0; ti < trashCount; ti++) {
        const sources = [
          { zoneId: `${player.name}.hand`, label: 'Hand' },
          { zoneId: `${player.name}.played`, label: 'In Play' },
          { zoneId: `${player.name}.revealed`, label: 'In Play' },
          { zoneId: `${player.name}.discard`, label: 'Discard' },
        ]
        const entries = []
        for (const { zoneId, label } of sources) {
          const zone = game.zones.byId(zoneId)
          if (!zone) {
            continue
          }
          for (const card of zone.cardlist()) {
            entries.push({ card, label })
          }
        }
        if (entries.length > 0) {
          const choices = [
            game.actions.option({ id: 'pass', title: 'Pass' }),
            ...entries.map(e => ({
              title: `${e.card.name} (${e.label})`,
              id: `${e.card.id}:${e.label}`,
              defId: e.card.defId,
              kind: 'imperium-card',
            })),
          ]
          const [choice] = game.actions.choose(player, choices, {
            title: trashCount > 1 ? `Choose a card to trash (${ti + 1} of ${trashCount})` : 'Choose a card to trash',
          })
          const chId = typeof choice === 'object' ? choice.id : choice
          if (chId !== 'pass' && choice !== 'Pass') {
            const entry = typeof choice === 'object'
              ? entries.find(e => `${e.card.id}:${e.label}` === choice.id)
              : entries.find(e => `${e.card.name} (${e.label})` === choice)
            if (entry) {
              deckEngine.trashCard(game, entry.card, player)
            }
          }
          else {
            game.log.add({
              template: '{player} chooses not to trash a card',
              args: { player },
            })
          }
        }
      }
      break
    }

    case 'steal-intrigue': {
      // Steal a random intrigue from each opponent with 4+ intrigue cards
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        const opponentIntrigue = game.zones.byId(`${opponent.name}.intrigue`)
        if (opponentIntrigue.cardlist().length >= 4) {
          const cards = opponentIntrigue.cardlist()
          const randomIndex = Math.floor(game.random() * cards.length)
          const stolen = cards[randomIndex]
          const playerIntrigue = game.zones.byId(`${player.name}.intrigue`)
          stolen.moveTo(playerIntrigue)
          game.log.add({
            template: '{player} steals {card} from {playerOpponent}',
            args: { player, card: stolen, playerOpponent: opponent },
            visibility: [player.name, opponent.name],
            redacted: '{player} steals an Intrigue card from {playerOpponent}',
          })
        }
      }
      break
    }

    case 'vp':
      player.incrementCounter('vp', effect.amount, { silent: true, source: sourceName || 'Effect' })
      game.log.add({
        template: '{player} gains {amount} Victory Point(s)',
        args: { player, amount: effect.amount },
      })
      break

    case 'influence':
      factions.gainInfluence(game, player, effect.faction, effect.amount)
      break

    case 'control':
      game.state.controlMarkers[effect.location] = player.name
      game.log.add({
        template: '{player} gains control of {location}',
        args: { player, location: effect.location },
      })
      break

    case 'intrigue-trash-draw': {
      // Trash an intrigue card from hand, then draw a new one
      const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
      const intrigueCards = intrigueZone.cardlist()
      if (intrigueCards.length > 0) {
        const trashChoices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          ...intrigueCards.map(c => game.actions.cardOption(c, 'intrigue-card')),
        ]
        const [trashChoice] = game.actions.choose(player, trashChoices, {
          title: 'Choose an Intrigue card to trash',
        })
        const trashId = typeof trashChoice === 'object' ? trashChoice.id : trashChoice
        if (trashId !== 'pass' && trashChoice !== 'Pass') {
          const card = typeof trashChoice === 'object'
            ? intrigueCards.find(c => c.id === trashChoice.id)
            : intrigueCards.find(c => c.name === trashChoice)
          if (card) {
            deckEngine.trashCard(game, card, player)
            deckEngine.drawIntrigueCard(game, player, 1)
          }
        }
        else {
          game.log.add({
            template: '{player} chooses not to trash a card',
            args: { player },
          })
        }
      }
      break
    }

    case 'recall-agent': {
      // Return one of your agents from the board (freeing the space).
      // Exclude the space this turn's agent occupies — an agent that
      // triggered this effect cannot recall itself. `agentSpaceId` (not the
      // local `space` param) is used because effects can resolve several
      // calls away from the agent-placement site (card ability, contract
      // completion, etc.) without `space` being threaded through.
      const currentAgentSpaceId = game.state.turnTracking?.agentSpaceId
      const occupiedSpaces = Object.entries(game.state.boardSpaces)
        .filter(([id, occupants]) => (occupants || []).includes(player.name) && id !== currentAgentSpaceId)
      if (occupiedSpaces.length > 0) {
        const boardSpaces = getBoardSpaces()
        const recallChoices = occupiedSpaces.map(([id]) => {
          const bs = boardSpaces.find(s => s.id === id)
          return game.actions.option({ id, title: bs ? bs.name : id, kind: 'board-space' })
        })
        const [recallChoice] = game.actions.choose(player, recallChoices, {
          title: 'Choose an Agent to recall',
        })
        const recallId = typeof recallChoice === 'object' ? recallChoice.id : null
        const recallTitle = typeof recallChoice === 'object' ? recallChoice.title : recallChoice
        const spaceId = recallId || occupiedSpaces.find(([id]) => {
          const bs = boardSpaces.find(s => s.id === id)
          return (bs ? bs.name : id) === recallTitle
        })?.[0]
        if (spaceId) {
          const occupants = game.state.boardSpaces[spaceId]
          const idx = occupants.indexOf(player.name)
          if (idx !== -1) {
            occupants.splice(idx, 1)
          }
          player.decrementCounter('agentsPlaced', 1, { silent: true })
          const space = boardSpaces.find(s => s.id === spaceId)
          game.log.add({
            template: '{player} recalls an Agent from {space}',
            args: { player, space: space ? space.name : spaceId },
          })
        }
      }
      break
    }

    case 'maker-hook':
      if (!game.state.makerHooks) {
        game.state.makerHooks = {}
      }
      game.state.makerHooks[player.name] = (game.state.makerHooks[player.name] || 0) + 1
      game.log.add({
        template: '{player} gains a Maker Hook',
        args: { player },
      })
      break

    case 'break-shield-wall':
      if (game.state.shieldWall) {
        game.state.shieldWall = false
        game.log.add({
          template: '{player} breaks the Shield Wall!',
          args: { player },
        })
      }
      break

    case 'sandworm': {
      // Sandworms cannot be summoned to a conflict protected by the Shield Wall
      if (isConflictProtected(game)) {
        game.log.add({
          template: 'Sandworm cannot be summoned — Conflict is protected by the Shield Wall',
          event: 'memo',
        })
        break
      }
      const count = effect.amount || 1
      game.state.conflict.deployedSandworms[player.name] =
        (game.state.conflict.deployedSandworms[player.name] || 0) + count
      game.log.add({
        template: '{player} summons {count} Sandworm(s)',
        args: { player, count },
      })
      break
    }

    case 'contract': {
      const choam = require('../systems/choam.js')
      const contractCount = effect.amount || 1
      for (let i = 0; i < contractCount; i++) {
        choam.takeContract(game, player)
      }
      break
    }

    case 'swords': {
      const { addStrength } = require('../systems/strengthBreakdown.js')
      addStrength(game, player, 'card', sourceName || 'Swords', effect.amount * constants.SWORD_STRENGTH)
      game.log.add({
        template: '{player} gains {amount} Sword(s)',
        args: { player, amount: effect.amount },
      })
      break
    }

    case 'retreat-troops': {
      const deployedTroops = game.state.conflict.deployedTroops[player.name] || 0
      const maxRetreat = Math.min(effect.amount, deployedTroops)
      if (maxRetreat > 0) {
        let retreatCount
        if (effect.choice) {
          const retreatChoices = []
          for (let i = 0; i <= maxRetreat; i++) {
            retreatChoices.push(game.actions.option({ id: `retreat-${i}`, title: `Retreat ${i} troop(s)` }))
          }
          const [retreatChoice] = game.actions.choose(player, retreatChoices, {
            title: 'Retreat troops from the Conflict',
          })
          const retreatId = typeof retreatChoice === 'object' ? retreatChoice.id : null
          retreatCount = retreatId
            ? parseInt(retreatId.replace('retreat-', ''))
            : parseInt(String(retreatChoice).match(/\d+/)[0])
        }
        else {
          retreatCount = maxRetreat
        }
        if (retreatCount > 0) {
          game.state.conflict.deployedTroops[player.name] -= retreatCount
          player.incrementCounter('troopsInSupply', retreatCount, { silent: true })
          game.log.add({
            template: '{player} retreats {count} troop(s)',
            args: { player, count: retreatCount },
          })
        }
      }
      break
    }

    case 'recall-spy-cost': {
      const spyMod = require('../systems/spies.js')
      spyMod.recallSpy(game, player)
      if (game.state.turnTracking) {
        game.state.turnTracking.recalledSpy = true
      }
      break
    }

    case 'trash-self':
      if (card) {
        deckEngine.trashCard(game, card, player)
      }
      break

    case 'extra-influence': {
      // The engine grants +1 faction influence at agent placement before
      // card abilities resolve, so by the time we get here the standard +1
      // is already on the board. Directly grant 1 more with the faction
      // matching the space the player just sent to.
      const faction = game.state.turnTracking?.spaceIcon
      if (faction && constants.FACTIONS.includes(faction)) {
        factions.gainInfluence(game, player, faction, 1)
      }
      else if (game.state.turnTracking) {
        // Fallback for non-faction spaces or future callers: keep the flag
        // so other code paths that read it still work.
        game.state.turnTracking.extraInfluence = true
      }
      break
    }

    case 'conditional': {
      if (checkCondition(game, player, effect.condition, card)) {
        for (const subEffect of effect.effects) {
          resolveEffect(game, player, subEffect, space, sourceName, card)
        }
      }
      break
    }

    case 'lose-troops': {
      const loseCount = Math.min(effect.amount, player.troopsInGarrison)
      if (loseCount > 0) {
        player.decrementCounter('troopsInGarrison', loseCount, { silent: true })
        game.log.add({
          template: '{player} loses {count} troop(s)',
          args: { player, count: loseCount },
        })
      }
      break
    }

    case 'lose-influence': {
      const factionChoices = constants.FACTIONS
        .filter(f => player.getInfluence(f) > 0)
        .map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      if (factionChoices.length > 0) {
        const [factionChoice] = game.actions.choose(player, factionChoices, {
          title: 'Choose faction to lose Influence',
        })
        const faction = typeof factionChoice === 'object' ? factionChoice.id : factionChoice
        factions.loseInfluence(game, player, faction, effect.amount)
      }
      break
    }

    case 'deploy-to-conflict': {
      const garrisoned = player.troopsInGarrison
      const maxDeploy = Math.min(effect.amount, garrisoned)
      if (maxDeploy > 0) {
        const deployChoices = []
        for (let i = 0; i <= maxDeploy; i++) {
          deployChoices.push(game.actions.option({ id: `deploy-${i}`, title: `Deploy ${i} troop(s) to Conflict` }))
        }
        const [deployChoice] = game.actions.choose(player, deployChoices, {
          title: 'Deploy troops to the Conflict',
        })
        const deployId = typeof deployChoice === 'object' ? deployChoice.id : null
        const count = deployId
          ? parseInt(deployId.replace('deploy-', ''))
          : parseInt(String(deployChoice).match(/\d+/)[0])
        if (count > 0) {
          player.decrementCounter('troopsInGarrison', count, { silent: true })
          deploy.deployToConflict(game, player, count)
          game.log.add({
            template: '{player} deploys {count} troop(s) to the Conflict',
            args: { player, count },
          })
        }
      }
      break
    }

    case 'opponent-discard': {
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        const oppHand = game.zones.byId(`${opponent.name}.hand`)
        const oppCards = oppHand.cardlist()
        if (oppCards.length > 0) {
          const card = game.actions.chooseCard(opponent, oppCards, {
            title: 'Choose a card to discard',
            kind: 'imperium-card',
          })
          if (card) {
            deckEngine.discardCard(game, opponent, card)
            game.log.add({
              template: '{player} discards a card',
              args: { player: opponent },
            })
          }
        }
      }
      break
    }

    case 'opponent-lose-troop': {
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        if (opponent.troopsInGarrison > 0) {
          opponent.decrementCounter('troopsInGarrison', 1, { silent: true })
          game.log.add({
            template: '{player} loses 1 troop',
            args: { player: opponent },
          })
        }
      }
      break
    }

    case 'force-retreat': {
      // Force one enemy unit to retreat from the conflict
      const opponents = game.players.all().filter(p =>
        p.name !== player.name && (game.state.conflict.deployedTroops[p.name] || 0) > 0
      )
      if (opponents.length > 0) {
        const target = game.actions.choosePlayer(player, opponents, {
          title: 'Choose opponent to force retreat',
        })
        game.state.conflict.deployedTroops[target.name]--
        target.incrementCounter('troopsInSupply', 1, { silent: true })
        game.log.add({
          template: '{player} forces {target} to retreat 1 troop',
          args: { player, target },
        })
      }
      break
    }

    case 'shuffle-discard': {
      const discardZone = game.zones.byId(`${player.name}.discard`)
      const deckZone = game.zones.byId(`${player.name}.deck`)
      for (const card of discardZone.cardlist()) {
        card.moveTo(deckZone)
      }
      deckZone.shuffle(game.random)
      game.log.add({
        template: '{player} shuffles discard pile into deck',
        args: { player },
      })
      break
    }

    case 'opponent-discard-or-lose': {
      for (const opponent of game.players.all()) {
        if (opponent.name === player.name) {
          continue
        }
        const oppHand = game.zones.byId(`${opponent.name}.hand`)
        const hasCards = oppHand.cardlist().length > 0
        const hasTroops = opponent.troopsInGarrison > 0
        if (hasCards && hasTroops) {
          const [choice] = game.actions.choose(opponent, [
            game.actions.option({ id: 'discard-card', title: 'Discard a card' }),
            game.actions.option({ id: 'lose-troop', title: 'Lose a troop' }),
          ], {
            title: 'Choose: discard a card or lose a troop',
          })
          const cId = typeof choice === 'object' ? choice.id : choice
          if (cId === 'discard-card' || choice === 'Discard a card') {
            resolveEffect(game, opponent, { type: 'opponent-discard', amount: 1 }, null)
          }
          else {
            opponent.decrementCounter('troopsInGarrison', 1, { silent: true })
            game.log.add({ template: '{player} loses 1 troop', args: { player: opponent } })
          }
        }
        else if (hasCards) {
          resolveEffect(game, opponent, { type: 'opponent-discard', amount: 1 }, null)
        }
        else if (hasTroops) {
          opponent.decrementCounter('troopsInGarrison', 1, { silent: true })
          game.log.add({ template: '{player} loses 1 troop', args: { player: opponent } })
        }
      }
      break
    }

    case 'double-harvest':
      // Doubles the base spice harvest at the current maker space (tracked via turn state)
      if (game.state.turnTracking) {
        game.state.turnTracking.doubleHarvest = true
      }
      break

    case 'complete-contract': {
      const choamComplete = require('../systems/choam.js')
      const playerContracts = game.zones.byId(`${player.name}.contracts`)
      const contracts = playerContracts.cardlist()
      if (contracts.length > 0) {
        const card = game.actions.chooseCard(player, contracts, {
          title: 'Choose a contract to complete',
          kind: 'contract',
        })
        if (card) {
          choamComplete.completeContract(game, player, card)
        }
      }
      break
    }

    case 'persuasion-per': {
      const count = countPerVariable(game, player, effect.per)
      const total = effect.amount * count
      if (total > 0) {
        player.incrementCounter('persuasion', total, { silent: true })
        game.log.add({
          template: '{player} gains {amount} Persuasion ({count} x {per})',
          args: { player, amount: total, count, per: effect.per },
        })
      }
      break
    }

    case 'swords-per': {
      const swordCount = countPerVariable(game, player, effect.per)
      const swordTotal = effect.amount * swordCount
      if (swordTotal > 0) {
        const { addStrength } = require('../systems/strengthBreakdown.js')
        addStrength(game, player, 'card', sourceName || 'Swords', swordTotal * constants.SWORD_STRENGTH)
        game.log.add({
          template: '{player} gains {amount} Sword(s) ({count} x {per})',
          args: { player, amount: swordTotal, count: swordCount, per: effect.per },
        })
      }
      break
    }
  }
}

/**
 * Count a variable for "per each X" effects.
 */
function countPerVariable(game, player, per) {
  if (/contract.*completed/i.test(per)) {
    const choamCount = require('../systems/choam.js')
    return choamCount.getCompletedContractCount(game, player)
  }
  const factionRevealedMatch = per.match(/(emperor|fremen|bene[\s-]gesserit|spacing\s+guild|guild)\s+card you revealed/i)
  if (factionRevealedMatch) {
    const target = constants.normalizeFactionId(factionRevealedMatch[1])
    const revealed = game.zones.byId(`${player.name}.revealed`).cardlist()
    return revealed.filter(c => constants.getFactionAffiliations(c).includes(target)).length
  }
  const factionInPlayMatch = per.match(/(emperor|fremen|bene[\s-]gesserit|spacing\s+guild|guild)\s+card in play/i)
  if (factionInPlayMatch) {
    const target = constants.normalizeFactionId(factionInPlayMatch[1])
    const played = game.zones.byId(`${player.name}.played`).cardlist()
    return played.filter(c => constants.getFactionAffiliations(c).includes(target)).length
  }
  if (/garrisoned troop/i.test(per)) {
    return player.troopsInGarrison
  }
  if (/deployed troop/i.test(per)) {
    return game.state.conflict.deployedTroops[player.name] || 0
  }
  if (/spy.*on.*board/i.test(per)) {
    const spySystem = require('../systems/spies.js')
    return spySystem.getSpyConnectedSpaces(game, player).size > 0 ? 1 : 0
  }
  return 0
}

/**
 * Check if a conditional effect's condition is met.
 */
function checkCondition(game, player, condition, card) {
  switch (condition.type) {
    case 'and':
      return condition.conditions.every(c => checkCondition(game, player, c, card))

    case 'influence':
      return player.getInfluence(condition.faction) >= condition.amount

    case 'completed-contracts': {
      const choamCheck = require('../systems/choam.js')
      return choamCheck.getCompletedContractCount(game, player) >= condition.amount
    }

    case 'recalled-spy':
      return !!(game.state.turnTracking && game.state.turnTracking.recalledSpy)

    case 'completed-contract-this-turn':
      return !!(game.state.turnTracking && game.state.turnTracking.completedContract)

    case 'gained-spice': {
      const gained = (game.state.turnTracking && game.state.turnTracking.spiceGained) || 0
      return gained >= condition.amount
    }

    case 'faction-card-in-play': {
      const playedZone = game.zones.byId(`${player.name}.played`)
      const revealedZone = game.zones.byId(`${player.name}.revealed`)
      const target = constants.normalizeFactionId(condition.faction)
      const inPlay = [...playedZone.cardlist(), ...revealedZone.cardlist()]
      return inPlay.some(c =>
        c !== card && constants.getFactionAffiliations(c).includes(target)
      )
    }

    case 'sandworms-in-conflict':
      return (game.state.conflict.deployedSandworms[player.name] || 0) >= condition.amount

    case 'units-in-conflict': {
      const troops = game.state.conflict.deployedTroops[player.name] || 0
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      return (troops + sandworms) >= condition.amount
    }

    case 'most-deployed-troops': {
      const myTroops = game.state.conflict.deployedTroops[player.name] || 0
      return game.players.all().every(p =>
        p.name === player.name || (game.state.conflict.deployedTroops[p.name] || 0) < myTroops
      )
    }

    case 'has-high-council':
      return !!player.hasHighCouncil

    case 'has-swordmaster':
      return player.getCounter('hasSwordmaster') > 0

    case 'has-alliance':
      return constants.FACTIONS.some(f => game.state.alliances[f] === player.name)

    case 'has-specific-alliance':
      return game.state.alliances[condition.faction] === player.name

    case 'occupying-maker-space': {
      const boardSpacesData = getBoardSpaces()
      return boardSpacesData.some(s => s.isMakerSpace && (game.state.boardSpaces[s.id] || []).includes(player.name))
    }

    case 'sent-to-maker':
      return !!(game.state.turnTracking && game.state.turnTracking.sentToMakerSpace)

    case 'sent-to-faction':
      return !!(game.state.turnTracking && game.state.turnTracking.sentToFactionSpace)

    case 'has-resource':
      return player.getCounter(condition.resource) >= condition.amount

    case 'has-persuasion':
      return player.getCounter('persuasion') >= condition.amount

    case 'has-garrison':
      return player.troopsInGarrison >= condition.amount

    case 'has-spies-on-board': {
      let count = 0
      for (const occupants of Object.values(game.state.spyPosts || {})) {
        for (const name of (occupants || [])) {
          if (name === player.name) {
            count++
          }
        }
      }
      return count >= condition.amount
    }

    case 'agent-on-space': {
      const allSpaces = getBoardSpaces()
      return allSpaces.some(s => {
        if (!(game.state.boardSpaces[s.id] || []).includes(player.name)) {
          return false
        }
        if (['green', 'purple', 'yellow'].includes(condition.icon)) {
          return s.icon === condition.icon
        }
        // Faction name
        return s.faction === condition.icon || s.icon === condition.icon
      })
    }

    case 'sent-to-occupied':
      return !!(game.state.turnTracking && game.state.turnTracking.sentToOccupied)

    case 'deck-size': {
      const deckSize = game.zones.byId(`${player.name}.deck`).cardlist().length
      return deckSize >= condition.amount
    }

    case 'opponent-has-alliance':
      return constants.FACTIONS.some(f =>
        game.state.alliances[f] && game.state.alliances[f] !== player.name
      )

    default:
      return false
  }
}

/**
 * Get the effective cost for a board space, handling dynamic costs.
 */
/**
 * Offer the player a chance to play a Plot Intrigue card.
 * Loops until the player passes, so they can play multiple plot cards.
 */
function offerPlotIntrigue(game, player) {
  while (true) {
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const plotCards = intrigueZone.cardlist().filter(c =>
      c.definition && c.definition.plotEffect
    )

    if (plotCards.length === 0) {
      return
    }

    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...plotCards.map(c => game.actions.cardOption(c, 'intrigue-card')),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Play a Plot Intrigue card?',
    })

    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'pass' || choice === 'Pass') {
      return
    }

    const card = typeof choice === 'object'
      ? plotCards.find(c => c.id === choice.id)
      : plotCards.find(c => c.name === choice)
    if (!card) {
      return
    }

    const discardZone = game.zones.byId('common.intrigueDiscard')
    card.moveTo(discardZone)
    game.log.add({
      template: '{player} plays {card} (Plot)',
      args: { player, card },
      summary: true,
    })

    const plotEffect = card.definition.plotEffect
    if (typeof plotEffect === 'function') {
      game.log.indent()
      plotEffect(game, player, card, { resolveEffect })
      game.log.outdent()
      continue
    }

    const effects = card.definition.plotEffects
    game.log.indent()
    if (effects) {
      for (const effect of effects) {
        resolveEffect(game, player, effect, null)
      }
    }
    else {
      game.log.add({
        template: '{effect}',
        args: { effect: plotEffect },
        event: 'memo',
      })
    }
    game.log.outdent()
  }
}

/**
 * Check if the current conflict is at a location protected by the Shield Wall.
 */
function isConflictProtected(game) {
  if (!game.state.shieldWall) {
    return false
  }
  const currentCard = game.state.conflict.currentCard
  if (!currentCard || !currentCard.location) {
    return false
  }
  const boardSpacesData = getBoardSpaces()
  const locationSpace = boardSpacesData.find(s => s.id === currentCard.location)
  return locationSpace && locationSpace.isProtected
}

function getSpaceCost(game, space, player) {
  let cost
  if (space.dynamicCost === 'sword-master') {
    // 8 solari for the first player, 6 solari after
    const anyoneHasSwordmaster = game.players.all().some(p => p.getCounter('hasSwordmaster') > 0)
    cost = { solari: anyoneHasSwordmaster ? 6 : 8 }
  }
  else {
    cost = space.cost ? { ...space.cost } : null
  }

  // Apply leader cost modifications
  if (player && cost) {
    cost = leaderAbilities.modifySpaceCost(game, player, space, cost)
  }
  return cost
}

/**
 * Get the board spaces data, loading lazily.
 */
function getBoardSpaces() {
  return require('../res/boardSpaces.js')
}

module.exports = {
  playerTurnsPhase,
  agentTurn,
  revealTurn,
  canSendAgentTo,
  resolveEffect,
}
