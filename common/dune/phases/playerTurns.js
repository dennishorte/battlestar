const deckEngine = require('../systems/deckEngine.js')
const factions = require('../systems/factions.js')
const spies = require('../systems/spies.js')
const { parseAgentAbility } = require('../systems/cardEffects.js')
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

      game.log.add({
        template: "{player}'s Turn",
        args: { player },
        event: 'turn-start',
      })

      if (player.availableAgents > 0) {
        const choices = ['Agent Turn', 'Reveal Turn']
        const [choice] = game.actions.choose(player, choices, {
          title: 'Choose Turn Type',
        })

        if (choice === 'Agent Turn') {
          agentTurn(game, player)
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
function agentTurn(game, player) {
  game.log.add({
    template: '{player}: Agent Turn',
    args: { player },
    event: 'player-turn',
  })
  game.log.indent()

  // Offer Plot Intrigue at start of turn
  offerPlotIntrigue(game, player)

  // Step 1: Choose a card from hand
  const handZone = game.zones.byId(`${player.name}.hand`)
  const handCards = handZone.cardlist()
  const playableCards = handCards.filter(c => c.agentIcons.length > 0 || c.factionAccess.length > 0 || c.spyAccess)

  if (playableCards.length === 0) {
    game.log.add({ template: 'No playable cards', event: 'memo' })
    // Force reveal turn instead
    game.log.outdent()
    revealTurn(game, player)
    return
  }

  const cardChoices = playableCards.map(c => c.name)
  const [cardChoice] = game.actions.choose(player, cardChoices, {
    title: 'Choose a card to play',
  })
  const card = playableCards.find(c => c.name === cardChoice)

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
  const cost = getSpaceCost(game, space)
  if (cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      player.decrementCounter(resource, amount, { silent: true })
      game.log.add({
        template: '{player} pays {amount} {resource}',
        args: { player, amount, resource },
      })
    }
  }

  // Gain faction influence if faction space
  if (space.faction) {
    factions.gainInfluence(game, player, space.faction)
  }

  // Resolve card agent ability
  resolveCardAgentAbility(game, player, card)

  // Resolve board space effects
  resolveBoardSpaceEffects(game, player, space)

  // Deploy units if combat space
  if (space.isCombatSpace) {
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

  // Offer to play a Plot Intrigue card
  offerPlotIntrigue(game, player)

  game.log.outdent()
}

/**
 * Reveal Turn: Reveal hand, resolve effects, set strength, acquire cards, clean up.
 */
function revealTurn(game, player) {
  game.log.add({
    template: '{player}: Reveal Turn',
    args: { player },
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
  while (player.getCounter('persuasion') > 0) {
    const persuasion = player.getCounter('persuasion')
    const acquirableCards = getAcquirableCards(game, persuasion)

    if (acquirableCards.length === 0) {
      break
    }

    const choices = ['Pass', ...acquirableCards.map(c => c.name)]
    const selected = game.actions.choose(player, choices, {
      title: `Acquire cards (${persuasion} Persuasion available)`,
    })
    const choice = selected[0]

    if (choice === 'Pass') {
      break
    }

    const card = acquirableCards.find(c => c.name === choice)
    if (card) {
      player.decrementCounter('persuasion', card.persuasionCost, { silent: true })
      deckEngine.acquireCard(game, player, card)

      // The Spice Must Flow grants +1 VP on acquisition
      if (card.name === 'The Spice Must Flow') {
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({
          template: '{player} gains 1 Victory Point (The Spice Must Flow)',
          args: { player },
        })
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
  // Check icon access
  const hasMatchingIcon = card.agentIcons.includes(space.icon) || card.factionAccess.includes(space.icon)
  const hasSpyConnection = card.spyAccess && spies.hasSpyAt(game, player, space.id)
  if (!hasMatchingIcon && !hasSpyConnection) {
    return false
  }

  // Space occupancy check — can infiltrate if spy on connected post
  if (game.state.boardSpaces[space.id]) {
    if (!spies.hasSpyAt(game, player, space.id)) {
      return false
    }
  }

  // Player must be able to pay the cost
  const cost = getSpaceCost(game, space)
  if (cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      if (player.getCounter(resource) < amount) {
        return false
      }
    }
  }

  // Swordmaster: can't visit if you already have one
  if (space.id === 'sword-master' && player.getCounter('hasSwordmaster') > 0) {
    return false
  }

  // Influence requirements
  if (space.influenceRequirement) {
    const req = space.influenceRequirement
    if (player.getInfluence(req.faction) < req.amount) {
      return false
    }
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
      break

    case 'troop': {
      const recruit = Math.min(effect.amount, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
        game.log.add({
          template: '{player} recruits {amount} troop(s)',
          args: { player, amount: recruit },
        })
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
      const base = effect.amount || 0
      const bonus = (space && game.state.bonusSpice[space.id]) || 0
      const total = base + bonus
      if (total > 0) {
        player.incrementCounter('spice', total, { silent: true })
        game.log.add({
          template: '{player} harvests {total} Spice ({base} base + {bonus} bonus)',
          args: { player, total, base, bonus },
        })
        if (space) {
          game.state.bonusSpice[space.id] = 0
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
        if (c.requires === 'maker-hook' && !game.state.makerHooks?.[player.name]) {
          return false
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
      const count = effect.amount || 1
      game.state.conflict.deployedSandworms[player.name] =
        (game.state.conflict.deployedSandworms[player.name] || 0) + count
      game.log.add({
        template: '{player} summons {count} Sandworm(s)',
        args: { player, count },
      })
      break
    }
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

    // Try to parse and execute the plot effect
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

function getSpaceCost(game, space) {
  if (space.dynamicCost === 'sword-master') {
    // 8 solari for the first player, 6 solari after
    const anyoneHasSwordmaster = game.players.all().some(p => p.getCounter('hasSwordmaster') > 0)
    return { solari: anyoneHasSwordmaster ? 6 : 8 }
  }
  return space.cost || null
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
