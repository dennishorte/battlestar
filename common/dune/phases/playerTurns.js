const deckEngine = require('../systems/deckEngine.js')
const factions = require('../systems/factions.js')
const spies = require('../systems/spies.js')
const { parseAgentAbility } = require('../systems/cardEffects.js')
const leaderAbilities = require('../systems/leaderAbilities.js')
const constants = require('../res/constants.js')

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

      game.log.add({
        template: `${player.name}'s Turn`,
        event: 'turn-start',
        args: { player },
      })

      if (player.availableAgents > 0) {
        // Build playable card list for nested Agent Turn choice
        const handZone = game.zones.byId(`${player.name}.hand`)
        const handCards = handZone.cardlist()
        const playableCards = handCards.filter(c => c.agentIcons.length > 0 || c.factionAccess.length > 0 || c.spyAccess)

        const choices = []
        if (playableCards.length > 0) {
          choices.push({
            title: 'Agent Turn',
            choices: playableCards.map(c => c.name),
          })
        }
        choices.push('Reveal Turn')

        const [choice] = game.actions.choose(player, choices, {
          title: 'Choose Turn',
        })

        if (choice.title === 'Agent Turn') {
          const cardName = choice.selection[0]
          const card = playableCards.find(c => c.name === cardName)
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

  // Initialize turn tracking for conditional card abilities
  game.state.turnTracking = {
    recalledSpy: false,
    completedContract: false,
    spiceGained: 0,
    sentToMakerSpace: false,
    sentToFactionSpace: false,
  }

  // Leader start-of-turn hook
  leaderAbilities.onAgentTurnStart(game, player)

  // Offer Plot Intrigue at start of turn
  offerPlotIntrigue(game, player)

  // Step 2: Choose a board space
  const boardSpaces = getBoardSpaces()
  const validSpaces = boardSpaces.filter(space => canSendAgentTo(game, player, card, space))

  if (validSpaces.length === 0) {
    game.log.add({ template: 'No valid board spaces', event: 'memo' })
    game.log.outdent()
    return
  }

  const spaceChoices = validSpaces.map(s => s.name)
  const [spaceChoice] = game.actions.choose(player, spaceChoices, {
    title: 'Choose a board space',
  })
  const space = validSpaces.find(s => s.name === spaceChoice)

  // Spy actions before placing agent
  const spaceOccupied = !!game.state.boardSpaces[space.id]
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
    const giChoices = ['No', 'Yes — recall Spy to draw a card']
    const [giChoice] = game.actions.choose(player, giChoices, {
      title: 'Gather Intelligence?',
    })
    if (giChoice !== 'No') {
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
  game.state.boardSpaces[space.id] = player.name
  player.incrementCounter('agentsPlaced', 1, { silent: true })

  game.log.add({
    template: '{player} sends Agent to {boardSpace}',
    args: { player, boardSpace: space.name },
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

  // Resolve card agent ability
  resolveCardAgentAbility(game, player, card)

  // Resolve board space effects
  resolveBoardSpaceEffects(game, player, space)

  // Lady Jessica / Reverend Mother: leader ability on BG/Fremen spaces
  leaderAbilities.onAgentPlaced(game, player, space, resolveBoardSpaceEffects)

  // Staban Tuek: opponents gain spice when you visit a maker space they're spying on
  if (space.isMakerSpace) {
    leaderAbilities.onOpponentVisitsMakerSpace(game, player, space)
  }

  // Deploy units if combat space (or card made it a combat space)
  if (space.isCombatSpace || game.state.turnTracking?.spaceIsCombat) {
    deployUnits(game, player)
  }

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

  // Check contract completion for board space visit
  const choam = require('../systems/choam.js')
  choam.checkContractCompletion(game, player, 'board-space', { spaceId: space.id })

  // Offer to play a Plot Intrigue card
  offerPlotIntrigue(game, player)

  game.log.outdent()
}

/**
 * Reveal Turn: Reveal hand, resolve effects, set strength, acquire cards, clean up.
 */
function revealTurn(game, player) {
  game.log.add({
    template: 'Reveal',
    event: 'player-turn',
  })
  game.log.indent()

  // Offer Plot Intrigue at start of turn
  offerPlotIntrigue(game, player)

  // Step 1: Reveal all remaining hand cards
  const revealedCards = deckEngine.revealHand(game, player)

  // Step 2: Resolve reveal effects — accumulate persuasion and swords
  let totalPersuasion = 0
  let totalSwords = 0

  for (const card of revealedCards) {
    totalPersuasion += card.revealPersuasion || 0
    totalSwords += card.revealSwords || 0
  }

  if (totalPersuasion > 0) {
    player.incrementCounter('persuasion', totalPersuasion, { silent: true })
    game.log.add({
      template: '{player} gains {amount} Persuasion',
      args: { player, amount: totalPersuasion },
    })
  }

  // Resolve card reveal abilities
  for (const card of revealedCards) {
    resolveCardRevealAbility(game, player, card, revealedCards)
  }

  // Leader reveal turn hook
  leaderAbilities.onRevealTurn(game, player)

  // Set combat strength
  const troops = game.state.conflict.deployedTroops[player.name] || 0
  const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
  const hasUnits = (troops + sandworms) > 0

  if (hasUnits) {
    const strength = troops * constants.TROOP_STRENGTH
      + sandworms * constants.SANDWORM_STRENGTH
      + totalSwords * constants.SWORD_STRENGTH
    player.setCounter('strength', strength, { silent: true })
    game.log.add({
      template: '{player} sets strength to {strength}',
      args: { player, strength },
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
 * Let player spend persuasion to acquire cards.
 */
function acquireCardsPhase(game, player) {
  const useSolari = game.state.turnTracking?.acquireWithSolari
  while (true) {
    const budget = useSolari ? player.solari : player.getCounter('persuasion')
    if (budget <= 0) {
      break
    }

    const acquirableCards = getAcquirableCards(game, budget)
    if (acquirableCards.length === 0) {
      break
    }

    const resource = useSolari ? 'Solari' : 'Persuasion'
    const choices = ['Pass', ...acquirableCards.map(c => c.name)]
    const selected = game.actions.choose(player, choices, {
      title: `Acquire cards (${budget} ${resource} available)`,
    })
    const choice = selected[0]

    if (choice === 'Pass') {
      break
    }

    const card = acquirableCards.find(c => c.name === choice)
    if (card) {
      // Pay with persuasion (or solari if Price is Not Object active)
      if (game.state.turnTracking?.acquireWithSolari) {
        player.decrementCounter('solari', card.persuasionCost, { silent: true })
      }
      else {
        player.decrementCounter('persuasion', card.persuasionCost, { silent: true })
      }

      // Acquire to top of deck or discard pile
      if (game.state.turnTracking?.acquireToTopOfDeck) {
        const deckZone = game.zones.byId(`${player.name}.deck`)
        card.moveTo(deckZone)
        game.log.add({ template: '{player} acquires {card} to top of deck', args: { player, card } })
        deckEngine.refillImperiumRow(game)
      }
      else {
        deckEngine.acquireCard(game, player, card)
      }

      // Troop on acquire (Call to Arms)
      if (game.state.turnTracking?.troopOnAcquire) {
        const recruit = Math.min(1, player.troopsInSupply)
        if (recruit > 0) {
          player.decrementCounter('troopsInSupply', recruit, { silent: true })
          player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          game.log.add({ template: '{player}: +1 Troop (Call to Arms)', args: { player } })
        }
      }

      // The Spice Must Flow grants +1 VP on acquisition
      if (card.name === 'The Spice Must Flow') {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({
          template: '{player} gains 1 Victory Point (The Spice Must Flow)',
          args: { player },
        })
        // Check contract completion
        const choamTsmf = require('../systems/choam.js')
        choamTsmf.checkContractCompletion(game, player, 'acquire-tsmf', {})
      }
    }
  }
}

/**
 * Get all cards the player can acquire given their current persuasion.
 */
function getAcquirableCards(game, persuasion) {
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

  return cards
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
  if (game.state.boardSpaces[space.id]) {
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

  // Blocked spaces (The Voice)
  if (game.state.blockedSpaces?.includes(space.id) && game.state.boardSpaces[space.id] !== player.name) {
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

  const maxFromGarrison = Math.min(2, garrisoned)
  const choices = []
  for (let i = 0; i <= maxFromGarrison; i++) {
    choices.push(`Deploy ${i} troop(s) from garrison`)
  }

  const [choice] = game.actions.choose(player, choices, {
    title: 'Deploy troops to the Conflict',
  })

  const count = parseInt(choice.match(/\d+/)[0])
  if (count > 0) {
    player.decrementCounter('troopsInGarrison', count, { silent: true })
    game.state.conflict.deployedTroops[player.name] =
      (game.state.conflict.deployedTroops[player.name] || 0) + count
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
          const targetChoices = ['Pass', ...opponents.map(p => p.name)]
          const [targetName] = game.actions.choose(player, targetChoices, {
            title: 'Force an enemy troop to retreat?',
          })
          if (targetName !== 'Pass') {
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

  // Check for card-specific implementation function
  const { getImplementation } = require('../systems/cardImplementations.js')
  const impl = getImplementation(card.name)
  if (impl && impl.agentEffect) {
    impl.agentEffect(game, player, card)
    return
  }

  const effects = parseAgentAbility(abilityText)
  if (!effects) {
    // Complex ability we can't execute yet — log it
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
      deckEngine.trashCard(game, card)
    }
    else if (effect.type === 'discard-card') {
      // Discard from hand
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const choices = handCards.map(c => c.name)
        const [discardChoice] = game.actions.choose(player, choices, {
          title: 'Choose a card to discard',
        })
        const discardCard = handCards.find(c => c.name === discardChoice)
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
      resolveEffect(game, player, effect, null)
    }
  }
}

/**
 * Resolve a card's reveal ability, including faction bond checks.
 * Bond abilities activate when you have another card of the same faction revealed.
 */
function resolveCardRevealAbility(game, player, card, allRevealedCards) {
  const abilityText = card.definition?.revealAbility
  if (!abilityText) {
    return
  }

  // Check for card-specific implementation function
  const { getImplementation: getRevealImpl } = require('../systems/cardImplementations.js')
  const revealImpl = getRevealImpl(card.name)
  if (revealImpl && revealImpl.revealEffect) {
    revealImpl.revealEffect(game, player, card, allRevealedCards)
    return
  }

  // Check for bond pattern: "Faction Bond: effect"
  const bondMatch = abilityText.match(/^(\w+)\s+[Bb]ond:\s*(.+)$/i)
  if (bondMatch) {
    const bondFaction = bondMatch[1].toLowerCase()
    const bondEffect = bondMatch[2].trim()

    // Check if another revealed card has the same faction affiliation
    const hasBond = allRevealedCards.some(c =>
      c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes(bondFaction)
    )

    if (!hasBond) {
      return
    }

    game.log.add({
      template: '{card}: {faction} Bond activates',
      args: { card: card.name, faction: bondMatch[1] },
    })

    // Parse the bond effect — handle swords specially
    const swordMatch = bondEffect.match(/^\+(\d+)\s+Swords?$/i)
    if (swordMatch) {
      const swords = parseInt(swordMatch[1])
      player.incrementCounter('strength', swords * constants.SWORD_STRENGTH, { silent: true })
      game.log.add({
        template: '{player} gains {amount} Sword(s)',
        args: { player, amount: swords },
      })
      return
    }

    const effects = parseAgentAbility(bondEffect)
    if (effects) {
      for (const effect of effects) {
        resolveEffect(game, player, effect, null)
      }
    }
    return
  }

  // Non-bond reveal abilities — parse with the same parser
  const effects = parseAgentAbility(abilityText)
  if (!effects) {
    // Complex ability — log it
    game.log.add({
      template: 'Reveal ability: {ability}',
      args: { ability: abilityText },
      event: 'memo',
    })
    return
  }

  for (const effect of effects) {
    resolveEffect(game, player, effect, null)
  }
}

function resolveBoardSpaceEffects(game, player, space) {
  if (!space.effects) {
    return
  }

  for (const effect of space.effects) {
    resolveEffect(game, player, effect, space)
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
function resolveEffect(game, player, effect, space) {
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
          game.state.conflict.deployedTroops[player.name] =
            (game.state.conflict.deployedTroops[player.name] || 0) + recruit
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
      spies.placeSpy(game, player)
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

      const labels = available.map(c => c.label)
      const [selected] = game.actions.choose(player, labels, {
        title: 'Choose an option',
      })
      const chosen = available.find(c => c.label === selected)

      // Pay choice cost
      if (chosen.cost) {
        for (const [resource, amount] of Object.entries(chosen.cost)) {
          player.decrementCounter(resource, amount, { silent: true })
          game.log.add({
            template: '{player} pays {amount} {resource}',
            args: { player, amount, resource },
          })
        }
      }

      // Resolve sub-effects
      for (const subEffect of chosen.effects) {
        resolveEffect(game, player, subEffect, space)
      }
      break
    }

    case 'influence-choice': {
      const factionChoices = constants.FACTIONS.map(f => f)
      const [faction] = game.actions.choose(player, factionChoices, {
        title: 'Choose a faction to gain Influence',
      })
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
        // 2nd time+: gain 2 spice, draw 1 intrigue, gain 3 troops
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
      // Let player choose a card from hand to trash
      const handZone = game.zones.byId(`${player.name}.hand`)
      const handCards = handZone.cardlist()
      if (handCards.length > 0) {
        const trashChoices = ['Pass', ...handCards.map(c => c.name)]
        const [trashChoice] = game.actions.choose(player, trashChoices, {
          title: 'Choose a card to trash',
        })
        if (trashChoice !== 'Pass') {
          const card = handCards.find(c => c.name === trashChoice)
          if (card) {
            deckEngine.trashCard(game, card)
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
            template: '{player} steals an Intrigue card from {opponent}',
            args: { player, opponent },
          })
        }
      }
      break
    }

    case 'vp':
      player.incrementCounter('vp', effect.amount, { silent: true })
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
        const trashChoices = ['Pass', ...intrigueCards.map(c => c.name)]
        const [trashChoice] = game.actions.choose(player, trashChoices, {
          title: 'Choose an Intrigue card to trash',
        })
        if (trashChoice !== 'Pass') {
          const card = intrigueCards.find(c => c.name === trashChoice)
          if (card) {
            deckEngine.trashCard(game, card)
            deckEngine.drawIntrigueCard(game, player, 1)
          }
        }
      }
      break
    }

    case 'recall-agent': {
      // Return one of your agents from the board (freeing the space)
      const occupiedSpaces = Object.entries(game.state.boardSpaces)
        .filter(([, occupant]) => occupant === player.name)
      if (occupiedSpaces.length > 0) {
        const boardSpaces = getBoardSpaces()
        const recallChoices = occupiedSpaces.map(([id]) => {
          const bs = boardSpaces.find(s => s.id === id)
          return bs ? bs.name : id
        })
        const [recallChoice] = game.actions.choose(player, recallChoices, {
          title: 'Choose an Agent to recall',
        })
        const spaceId = occupiedSpaces.find(([id]) => {
          const bs = boardSpaces.find(s => s.id === id)
          return (bs ? bs.name : id) === recallChoice
        })?.[0]
        if (spaceId) {
          game.state.boardSpaces[spaceId] = null
          player.decrementCounter('agentsPlaced', 1, { silent: true })
          game.log.add({
            template: '{player} recalls an Agent from {space}',
            args: { player, space: recallChoice },
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
      if (game.settings.useCHOAM) {
        const choam = require('../systems/choam.js')
        choam.takeContract(game, player)
      }
      else {
        // Without CHOAM module, contract icon gives 2 Solari
        player.incrementCounter('solari', 2, { silent: true })
        game.log.add({
          template: '{player} gains 2 Solari (contract)',
          args: { player },
        })
      }
      break
    }

    case 'swords':
      player.incrementCounter('strength', effect.amount * constants.SWORD_STRENGTH, { silent: true })
      game.log.add({
        template: '{player} gains {amount} Sword(s)',
        args: { player, amount: effect.amount },
      })
      break

    case 'retreat-troops': {
      const deployedTroops = game.state.conflict.deployedTroops[player.name] || 0
      const retreatCount = Math.min(effect.amount, deployedTroops)
      if (retreatCount > 0) {
        game.state.conflict.deployedTroops[player.name] -= retreatCount
        player.incrementCounter('troopsInSupply', retreatCount, { silent: true })
        game.log.add({
          template: '{player} retreats {count} troop(s)',
          args: { player, count: retreatCount },
        })
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

    case 'extra-influence':
      if (game.state.turnTracking) {
        game.state.turnTracking.extraInfluence = true
      }
      break

    case 'conditional': {
      if (checkCondition(game, player, effect.condition)) {
        for (const subEffect of effect.effects) {
          resolveEffect(game, player, subEffect, space)
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
      const factionChoices = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (factionChoices.length > 0) {
        const [faction] = game.actions.choose(player, factionChoices, {
          title: 'Choose faction to lose Influence',
        })
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
          deployChoices.push(`Deploy ${i} troop(s) to Conflict`)
        }
        const [deployChoice] = game.actions.choose(player, deployChoices, {
          title: 'Deploy troops to the Conflict',
        })
        const count = parseInt(deployChoice.match(/\d+/)[0])
        if (count > 0) {
          player.decrementCounter('troopsInGarrison', count, { silent: true })
          game.state.conflict.deployedTroops[player.name] =
            (game.state.conflict.deployedTroops[player.name] || 0) + count
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
          const [discardChoice] = game.actions.choose(opponent, oppCards.map(c => c.name), {
            title: 'Choose a card to discard',
          })
          const card = oppCards.find(c => c.name === discardChoice)
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
        const targetChoices = opponents.map(p => p.name)
        const [targetName] = game.actions.choose(player, targetChoices, {
          title: 'Choose opponent to force retreat',
        })
        game.state.conflict.deployedTroops[targetName]--
        const target = game.players.byName(targetName)
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
          const [choice] = game.actions.choose(opponent, ['Discard a card', 'Lose a troop'], {
            title: 'Choose: discard a card or lose a troop',
          })
          if (choice === 'Discard a card') {
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
        const choices = contracts.map(c => c.name)
        const [choice] = game.actions.choose(player, choices, {
          title: 'Choose a contract to complete',
        })
        const card = contracts.find(c => c.name === choice)
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
        player.incrementCounter('strength', swordTotal * constants.SWORD_STRENGTH, { silent: true })
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
  if (/fremen card in play/i.test(per)) {
    const played = game.zones.byId(`${player.name}.played`)
    return played.cardlist().filter(c => c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')).length
  }
  if (/bene gesserit card in play/i.test(per)) {
    const played = game.zones.byId(`${player.name}.played`)
    return played.cardlist().filter(c => c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('bene gesserit')).length
  }
  if (/emperor card in play/i.test(per)) {
    const played = game.zones.byId(`${player.name}.played`)
    return played.cardlist().filter(c => c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('emperor')).length
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
function checkCondition(game, player, condition) {
  switch (condition.type) {
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
      return playedZone.cardlist().some(c =>
        c.factionAffiliation && c.factionAffiliation.toLowerCase().includes(condition.faction)
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
      return boardSpacesData.some(s => s.isMakerSpace && game.state.boardSpaces[s.id] === player.name)
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
      const totalSpies = player.getCounter('spiesTotal') - player.spiesInSupply
      return totalSpies >= condition.amount
    }

    case 'agent-on-space': {
      const allSpaces = getBoardSpaces()
      return allSpaces.some(s => {
        if (game.state.boardSpaces[s.id] !== player.name) {
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

    const choices = ['Pass', ...plotCards.map(c => c.name)]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Play a Plot Intrigue card?',
    })

    if (choice === 'Pass') {
      return
    }

    const card = plotCards.find(c => c.name === choice)
    if (!card) {
      return
    }

    const discardZone = game.zones.byId('common.intrigueDiscard')
    card.moveTo(discardZone)
    game.log.add({
      template: '{player} plays {card} (Plot)',
      args: { player, card: card.name },
    })

    // Try implementation function, then parser
    const { getImplementation: getPlotImpl } = require('../systems/cardImplementations.js')
    const plotImpl = getPlotImpl(card.name)
    if (plotImpl && plotImpl.plotEffect) {
      game.log.indent()
      plotImpl.plotEffect(game, player, card)
      game.log.outdent()
      continue
    }

    const effectText = card.definition.plotEffect
    const effects = parseAgentAbility(effectText)
    if (effects) {
      game.log.indent()
      for (const effect of effects) {
        resolveEffect(game, player, effect, null)
      }
      game.log.outdent()
    }
    else {
      game.log.indent()
      game.log.add({
        template: '{effect}',
        args: { effect: effectText },
        event: 'memo',
      })
      game.log.outdent()
    }
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
