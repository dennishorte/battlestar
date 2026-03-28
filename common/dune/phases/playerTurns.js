const deckEngine = require('../systems/deckEngine.js')
const factions = require('../systems/factions.js')
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

  // Play the card and place the agent
  deckEngine.playCard(game, player, card)
  game.state.boardSpaces[space.id] = player.name
  player.incrementCounter('agentsPlaced', 1, { silent: true })

  game.log.add({
    template: '{player} sends Agent to {boardSpace}',
    args: { player, boardSpace: space.name },
  })

  // Pay board space cost
  if (space.cost) {
    for (const [resource, amount] of Object.entries(space.cost)) {
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
 */
function canSendAgentTo(game, player, card, space) {
  // Space must be unoccupied
  if (game.state.boardSpaces[space.id]) {
    return false
  }

  // Card must have a matching icon
  const hasMatchingIcon = card.agentIcons.includes(space.icon) || card.factionAccess.includes(space.icon)
  if (!hasMatchingIcon && !card.spyAccess) {
    return false
  }

  // Player must be able to pay the cost
  if (space.cost) {
    for (const [resource, amount] of Object.entries(space.cost)) {
      if (player.getCounter(resource) < amount) {
        return false
      }
    }
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
 * For now, handles the main resource-giving effects.
 */
function resolveBoardSpaceEffects(game, player, space) {
  if (!space.effects) {
    return
  }

  for (const effect of space.effects) {
    switch (effect.type) {
      case 'gain':
        player.incrementCounter(effect.resource, effect.amount, { silent: true })
        game.log.add({
          template: '{player} gains {amount} {resource}',
          args: { player, amount: effect.amount, resource: effect.resource },
        })
        break
      case 'troop':
        if (player.troopsInSupply >= effect.amount) {
          player.decrementCounter('troopsInSupply', effect.amount, { silent: true })
          player.incrementCounter('troopsInGarrison', effect.amount, { silent: true })
          game.log.add({
            template: '{player} recruits {amount} troop(s)',
            args: { player, amount: effect.amount },
          })
        }
        break
      case 'intrigue':
        deckEngine.drawIntrigueCard(game, player, effect.amount)
        break
      case 'draw':
        deckEngine.drawCards(game, player, effect.amount)
        break
      case 'spy':
        if (player.spiesInSupply > 0) {
          player.decrementCounter('spiesInSupply', 1, { silent: true })
          game.log.add({
            template: '{player} places a Spy',
            args: { player },
          })
        }
        break
      case 'spice-harvest': {
        const base = effect.amount || 0
        const bonus = game.state.bonusSpice[space.id] || 0
        const total = base + bonus
        if (total > 0) {
          player.incrementCounter('spice', total, { silent: true })
          game.log.add({
            template: '{player} harvests {total} Spice ({base} base + {bonus} bonus)',
            args: { player, total, base, bonus },
          })
          game.state.bonusSpice[space.id] = 0
        }
        break
      }
    }
  }
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
}
