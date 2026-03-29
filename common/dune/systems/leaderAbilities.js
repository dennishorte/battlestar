/**
 * Leader passive ability hooks.
 * Each hook is called at specific game moments to apply leader-specific effects.
 */
const leaders = require('./leaders.js')
const deckEngine = require('./deckEngine.js')

/**
 * Hook: called during reveal turn, after cards are revealed.
 */
function onRevealTurn(game, player) {
  const leader = leaders.getLeader(game, player)
  if (!leader) {
    return
  }

  switch (leader.name) {
    case "Muad'Dib": {
      // If one or more sandworms in conflict: +1 Intrigue
      const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
      if (sandworms >= 1) {
        deckEngine.drawIntrigueCard(game, player, 1)
        game.log.add({
          template: '{player}: Unpredictable Foe — +1 Intrigue card',
          args: { player },
        })
      }
      break
    }
    case 'Gurney Halleck': {
      // If 6+ strength (10 in 6-player): +1 Persuasion
      const threshold = game.settings.numPlayers >= 6 ? 10 : 6
      if (player.strength >= threshold) {
        player.incrementCounter('persuasion', 1, { silent: true })
        game.log.add({
          template: '{player}: Always Smiling — +1 Persuasion',
          args: { player },
        })
      }
      break
    }
    case 'Archduke Armand Ecaz': {
      // May trash one card in play
      const playedZone = game.zones.byId(`${player.name}.played`)
      const playedCards = playedZone.cardlist()
      if (playedCards.length > 0) {
        const choices = ['Pass', ...playedCards.map(c => c.name)]
        const [choice] = game.actions.choose(player, choices, {
          title: 'Coordination: Trash a card in play?',
        })
        if (choice !== 'Pass') {
          const card = playedCards.find(c => c.name === choice)
          if (card) {
            deckEngine.trashCard(game, card)
            game.log.add({
              template: '{player}: Coordination — trashes {card}',
              args: { player, card: card.name },
            })
          }
        }
      }
      break
    }
    case 'Feyd-Rautha Harkonnen': {
      // May recall a spy for 2 strength
      const spies = require('./spies.js')
      const constants = require('../res/constants.js')
      const observationPosts = require('../res/observationPosts.js')
      const playerPosts = observationPosts.filter(post => {
        const occupants = game.state.spyPosts[post.id] || []
        return occupants.includes(player.name)
      })
      if (playerPosts.length > 0) {
        const choices = ['Pass', ...playerPosts.map(p => `Post ${p.id}`)]
        const [choice] = game.actions.choose(player, choices, {
          title: 'Devious Strength: Recall a Spy for +2 Strength?',
        })
        if (choice !== 'Pass') {
          spies.recallSpy(game, player)
          player.incrementCounter('strength', 2 * constants.SWORD_STRENGTH, { silent: true })
          game.log.add({
            template: '{player}: Devious Strength — recalls Spy for +2 Strength',
            args: { player },
          })
        }
      }
      break
    }
    case 'Lady Amber Metulli': {
      // May retreat one troop from conflict
      const deployedTroops = game.state.conflict.deployedTroops[player.name] || 0
      if (deployedTroops > 0) {
        const choices = ['Pass', 'Retreat 1 troop']
        const [choice] = game.actions.choose(player, choices, {
          title: 'Desert Scouts: Retreat a troop?',
        })
        if (choice !== 'Pass') {
          game.state.conflict.deployedTroops[player.name]--
          player.incrementCounter('troopsInSupply', 1, { silent: true })
          game.log.add({
            template: '{player}: Desert Scouts — retreats 1 troop',
            args: { player },
          })
        }
      }
      break
    }
  }
}

/**
 * Hook: called when a player pays Solari for a board space cost.
 */
function onPaySolariForSpace(game, player) {
  const leader = leaders.getLeader(game, player)
  if (!leader) {
    return
  }

  if (leader.name === 'Count Ilban Richese') {
    // When you pay Solari for a board space: Draw 1 card
    deckEngine.drawCards(game, player, 1)
    game.log.add({
      template: '{player}: Ruthless Negotiator — draws 1 card',
      args: { player },
    })
  }
}

/**
 * Hook: called when a player gains the High Council seat.
 */
function onGainHighCouncil(game, player) {
  const leader = leaders.getLeader(game, player)
  if (!leader) {
    return
  }

  if (leader.name === 'Earl Memnon Thorvald') {
    // When you take a High Council seat: Gain +1 Influence
    const constants = require('../res/constants.js')
    const factions = require('./factions.js')
    const [faction] = game.actions.choose(player, constants.FACTIONS, {
      title: 'Connections: Choose faction for +1 Influence',
    })
    factions.gainInfluence(game, player, faction)
    game.log.add({
      template: '{player}: Connections — +1 Influence with {faction}',
      args: { player, faction },
    })
  }
}

/**
 * Hook: called when a player gains influence (after the gain).
 * Checks for one-time influence threshold bonuses.
 */
function onGainInfluence(game, player, faction, newLevel) {
  const leader = leaders.getLeader(game, player)
  if (!leader) {
    return
  }

  // Track which threshold bonuses have been triggered
  if (!game.state.leaderBonusTriggered) {
    game.state.leaderBonusTriggered = {}
  }
  const key = `${player.name}-${leader.name}-${faction}`

  if (leader.name === 'Princess Irulan' && faction === 'emperor' && newLevel >= 2) {
    if (!game.state.leaderBonusTriggered[key]) {
      game.state.leaderBonusTriggered[key] = true
      deckEngine.drawIntrigueCard(game, player, 1)
      game.log.add({
        template: '{player}: Imperial Birthright — +1 Intrigue card',
        args: { player },
      })
    }
  }

  if (leader.name === 'Lady Margot Fenring' && faction === 'bene-gesserit' && newLevel >= 2) {
    if (!game.state.leaderBonusTriggered[key]) {
      game.state.leaderBonusTriggered[key] = true
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({
        template: '{player}: Loyalty — +2 Spice',
        args: { player },
      })
    }
  }
}

/**
 * Hook: modify board space cost based on leader ability.
 */
function modifySpaceCost(game, player, space, baseCost) {
  const leader = leaders.getLeader(game, player)
  if (!leader || !baseCost) {
    return baseCost
  }

  if (leader.name === 'Duke Leto Atreides' && space.icon === 'green' && baseCost.solari) {
    return { ...baseCost, solari: Math.max(0, baseCost.solari - 1) }
  }

  if (leader.name === 'Duncan Idaho' && space.id === 'sword-master' && baseCost.solari) {
    return { ...baseCost, solari: Math.max(0, baseCost.solari - 2) }
  }

  return baseCost
}

/**
 * Hook: modify board space occupancy check based on leader ability.
 */
function ignoresOccupancy(game, player, space) {
  const leader = leaders.getLeader(game, player)
  if (!leader) {
    return false
  }

  if (leader.name === 'Helena Richese') {
    // Enemy Agents don't block at Green or Blue (purple) spaces
    return space.icon === 'green' || space.icon === 'purple'
  }

  return false
}

module.exports = {
  onRevealTurn,
  onPaySolariForSpace,
  onGainHighCouncil,
  onGainInfluence,
  modifySpaceCost,
  ignoresOccupancy,
}
