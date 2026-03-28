// const constants = require('../res/constants.js')  // TODO: needed for reward distribution

/**
 * Phase 3: Combat
 * 1. Players with units in the Conflict may play Combat Intrigue cards (pass-until-all-pass)
 * 2. Resolve combat: distribute rewards by strength ranking
 */
function combatPhase(game) {
  game.state.phase = 'combat'
  game.log.add({ template: 'Combat', event: 'phase-start' })

  // Determine which players are involved in combat (have units in conflict)
  const combatants = game.players.all().filter(p => {
    const troops = game.state.conflict.deployedTroops[p.name] || 0
    const sandworms = game.state.conflict.deployedSandworms[p.name] || 0
    return (troops + sandworms) > 0
  })

  if (combatants.length === 0) {
    game.log.add({ template: 'No units in Conflict — combat skipped', event: 'memo' })
    return
  }

  // Combat Intrigue card round (pass-until-all-pass)
  combatIntrigueRound(game, combatants)

  // Resolve combat
  resolveCombat(game)
}

/**
 * Combat Intrigue card round.
 * Players pass one at a time clockwise. Once all pass consecutively, the round ends.
 * If a player plays a card, the pass chain resets.
 */
function combatIntrigueRound(game, combatants) {
  if (combatants.length === 0) {
    return
  }

  let consecutivePasses = 0
  let currentIndex = 0

  while (consecutivePasses < combatants.length) {
    const player = combatants[currentIndex % combatants.length]

    // Check if player has combat intrigue cards
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const combatCards = intrigueZone.cardlist().filter(c =>
      c.definition && c.definition.combatEffect
    )

    if (combatCards.length > 0) {
      const choices = ['Pass', ...combatCards.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, {
        title: 'Play Combat Intrigue card or Pass',
      })

      if (choice === 'Pass') {
        consecutivePasses++
      }
      else {
        // Play the combat intrigue card
        const card = combatCards.find(c => c.name === choice)
        if (card) {
          const discardZone = game.zones.byId('common.intrigueDiscard')
          card.moveTo(discardZone)
          game.log.add({
            template: '{player} plays {card}',
            args: { player, card: card.name },
          })
          game.log.indent()
          // TODO: Resolve combat intrigue card effect
          game.log.add({
            template: '{effect}',
            args: { effect: card.definition.combatEffect || 'Effect resolves' },
            event: 'memo',
          })
          game.log.outdent()
        }
        consecutivePasses = 0
      }
    }
    else {
      // Auto-pass if no combat intrigue cards
      consecutivePasses++
    }

    currentIndex++
  }
}

/**
 * Resolve combat by ranking players by strength and distributing rewards.
 */
function resolveCombat(game) {
  game.log.add({ template: 'Resolve Combat', event: 'step' })
  game.log.indent()

  // Get all players with strength > 0
  const rankings = game.players.all()
    .filter(p => p.strength > 0)
    .sort((a, b) => b.strength - a.strength)

  if (rankings.length === 0) {
    game.log.add({ template: 'No players with strength — no rewards', event: 'memo' })
    game.log.outdent()
    afterCombat(game)
    return
  }

  // Determine placement groups (handling ties)
  const placements = []
  let currentStrength = -1
  let currentGroup = null

  for (const player of rankings) {
    if (player.strength !== currentStrength) {
      currentGroup = { strength: player.strength, players: [player] }
      placements.push(currentGroup)
      currentStrength = player.strength
    }
    else {
      currentGroup.players.push(player)
    }
  }

  // Log rankings
  for (const group of placements) {
    const names = group.players.map(p => p.name).join(', ')
    game.log.add({
      template: 'Strength {strength}: {names}',
      args: { strength: group.strength, names },
    })
  }

  const numPlayers = game.settings.numPlayers

  // Distribute rewards based on placements
  if (placements.length > 0) {
    const firstGroup = placements[0]

    if (firstGroup.players.length === 1) {
      // Clear winner
      const winner = firstGroup.players[0]
      game.log.add({
        template: '{player} wins the Conflict (1st place)',
        args: { player: winner },
      })
      // TODO: Award 1st place reward from conflict card
      // TODO: Winner takes conflict card, checks battle icons

      // Second place
      if (placements.length > 1) {
        const secondGroup = placements[1]
        if (secondGroup.players.length === 1) {
          game.log.add({
            template: '{player} gets 2nd place reward',
            args: { player: secondGroup.players[0] },
          })
          // TODO: Award 2nd place reward

          // Third place (4-player only)
          if (numPlayers >= 4 && placements.length > 2) {
            const thirdGroup = placements[2]
            if (thirdGroup.players.length === 1) {
              game.log.add({
                template: '{player} gets 3rd place reward',
                args: { player: thirdGroup.players[0] },
              })
              // TODO: Award 3rd place reward
            }
            // Tie for third: nothing
          }
        }
        else {
          // Tie for second: each gets 3rd place reward
          for (const player of secondGroup.players) {
            game.log.add({
              template: '{player} ties for 2nd place — gets 3rd place reward',
              args: { player },
            })
            // TODO: Award 3rd place reward
          }
        }
      }
    }
    else {
      // Tie for first: each gets 2nd place reward, no winner
      for (const player of firstGroup.players) {
        game.log.add({
          template: '{player} ties for 1st place — gets 2nd place reward',
          args: { player },
        })
        // TODO: Award 2nd place reward
      }

      // In 4+ player, if exactly 2 tied for first, remaining compete for 3rd
      if (numPlayers >= 4 && firstGroup.players.length === 2 && placements.length > 1) {
        const thirdGroup = placements[1]
        if (thirdGroup.players.length === 1) {
          game.log.add({
            template: '{player} gets 3rd place reward',
            args: { player: thirdGroup.players[0] },
          })
          // TODO: Award 3rd place reward
        }
      }
    }
  }

  game.log.outdent()

  afterCombat(game)
}

/**
 * After combat: troops return to supply, sandworms return to bank, reset strength.
 */
function afterCombat(game) {
  for (const player of game.players.all()) {
    const troops = game.state.conflict.deployedTroops[player.name] || 0
    if (troops > 0) {
      player.incrementCounter('troopsInSupply', troops, { silent: true })
      game.state.conflict.deployedTroops[player.name] = 0
    }

    game.state.conflict.deployedSandworms[player.name] = 0

    player.setCounter('strength', 0, { silent: true })
  }
}

module.exports = { combatPhase }
