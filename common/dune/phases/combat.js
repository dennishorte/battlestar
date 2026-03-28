const { resolveEffect } = require('./playerTurns.js')

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

  const conflictCard = game.state.conflict.currentCard
  const rewards = conflictCard ? conflictCard.rewards : null
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
      awardReward(game, winner, rewards?.first, '1st')

      // Winner takes conflict card (for battle icon tracking)
      if (conflictCard) {
        moveConflictCardToWinner(game, winner, conflictCard)
      }

      // Second place
      if (placements.length > 1) {
        const secondGroup = placements[1]
        if (secondGroup.players.length === 1) {
          game.log.add({
            template: '{player} gets 2nd place reward',
            args: { player: secondGroup.players[0] },
          })
          awardReward(game, secondGroup.players[0], rewards?.second, '2nd')

          // Third place (4-player only)
          if (numPlayers >= 4 && placements.length > 2) {
            const thirdGroup = placements[2]
            if (thirdGroup.players.length === 1) {
              game.log.add({
                template: '{player} gets 3rd place reward',
                args: { player: thirdGroup.players[0] },
              })
              awardReward(game, thirdGroup.players[0], rewards?.third, '3rd')
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
            awardReward(game, player, rewards?.third, '3rd')
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
        awardReward(game, player, rewards?.second, '2nd')
      }

      // In 4+ player, if exactly 2 tied for first, remaining compete for 3rd
      if (numPlayers >= 4 && firstGroup.players.length === 2 && placements.length > 1) {
        const thirdGroup = placements[1]
        if (thirdGroup.players.length === 1) {
          game.log.add({
            template: '{player} gets 3rd place reward',
            args: { player: thirdGroup.players[0] },
          })
          awardReward(game, thirdGroup.players[0], rewards?.third, '3rd')
        }
      }
    }
  }

  game.log.outdent()

  afterCombat(game)
}

/**
 * Parse a reward text string into an array of effect objects.
 * Handles patterns like:
 *   "+1 Victory point" -> { type: 'vp', amount: 1 }
 *   "+2 Spice"         -> { type: 'gain', resource: 'spice', amount: 2 }
 *   "+1 Influence"     -> { type: 'influence-choice', amount: 1 }
 *   "Arrakeen Control" -> { type: 'control', location: 'arrakeen' }
 *   "Trash a card"     -> { type: 'trash-card' }
 *   "+1 Intrigue card" -> { type: 'intrigue', amount: 1 }
 *   Compound: "X and Y and Z"
 *   Choice: "X OR Y"
 */
function parseRewardText(text) {
  if (!text) {
    return []
  }

  // Handle OR choices
  if (text.includes(' OR ')) {
    const parts = text.split(' OR ')
    return [{
      type: 'choice',
      choices: parts.map(p => ({
        label: p.trim(),
        effects: parseRewardText(p.trim()),
      })),
    }]
  }

  // Split compound rewards on " and " (but not within sub-phrases)
  const parts = text.split(' and ')
  const effects = []

  for (const part of parts) {
    const trimmed = part.trim()
    const effect = parseSingleReward(trimmed)
    if (effect) {
      effects.push(effect)
    }
  }

  return effects
}

/**
 * Parse a single reward phrase into an effect object.
 */
function parseSingleReward(text) {
  // "+N Victory point(s)"
  const vpMatch = text.match(/^\+(\d+)\s+Victory\s+point/i)
  if (vpMatch) {
    return { type: 'vp', amount: parseInt(vpMatch[1]) }
  }

  // "+N Influence" (choice of faction)
  const influenceMatch = text.match(/^\+(\d+)\s+Influence/i)
  if (influenceMatch) {
    return { type: 'influence-choice', amount: parseInt(influenceMatch[1]) }
  }

  // "Choose two of the 4 Factions. Gain +1 Influence in each."
  if (text.includes('Choose two') && text.includes('Influence')) {
    return { type: 'influence-choice-two' }
  }

  // "+N Intrigue card(s)" / "+N Intrigue"
  const intrigueMatch = text.match(/^\+(\d+)\s+Intrigue/i)
  if (intrigueMatch) {
    return { type: 'intrigue', amount: parseInt(intrigueMatch[1]) }
  }

  // "+N Spice"
  const spiceMatch = text.match(/^\+(\d+)\s+Spice/i)
  if (spiceMatch) {
    return { type: 'gain', resource: 'spice', amount: parseInt(spiceMatch[1]) }
  }

  // "+N Solari"
  const solariMatch = text.match(/^\+(\d+)\s+Solari/i)
  if (solariMatch) {
    return { type: 'gain', resource: 'solari', amount: parseInt(solariMatch[1]) }
  }

  // "+N Water"
  const waterMatch = text.match(/^\+(\d+)\s+Water/i)
  if (waterMatch) {
    return { type: 'gain', resource: 'water', amount: parseInt(waterMatch[1]) }
  }

  // "Location Control"
  const controlMatch = text.match(/(Arrakeen|Carthag|Imperial Basin|Spice Refinery)\s+Control/i)
  if (controlMatch) {
    const locationMap = {
      'arrakeen': 'arrakeen',
      'carthag': 'spice-refinery',
      'imperial basin': 'imperial-basin',
      'spice refinery': 'spice-refinery',
    }
    return { type: 'control', location: locationMap[controlMatch[1].toLowerCase()] }
  }

  // "Trash a card"
  if (/^Trash a card/i.test(text)) {
    return { type: 'trash-card' }
  }

  // "Mentat" — TODO: implement mentat recruitment
  if (/^Mentat/i.test(text)) {
    return null
  }

  // "+1 Spy with Deep Cover" — TODO: implement spy deep cover
  if (/Spy/i.test(text)) {
    return null
  }

  return null
}

/**
 * Award parsed rewards to a player.
 */
function awardReward(game, player, rewardText) {
  if (!rewardText) {
    return
  }

  const effects = parseRewardText(rewardText)
  game.log.indent()

  for (const effect of effects) {
    if (effect.type === 'influence-choice-two') {
      // Special: choose 2 factions for +1 influence each
      const constants = require('../res/constants.js')
      const factions = require('../systems/factions.js')
      for (let i = 0; i < 2; i++) {
        const remaining = constants.FACTIONS
        const [faction] = game.actions.choose(player, remaining, {
          title: `Choose faction for Influence (${i + 1} of 2)`,
        })
        factions.gainInfluence(game, player, faction)
      }
    }
    else {
      resolveEffect(game, player, effect, null)
    }
  }

  game.log.outdent()
}

/**
 * Move conflict card to winner's collection and check battle icons.
 */
function moveConflictCardToWinner(game, winner, conflictCard) {
  // Track won conflict cards per player for battle icon scoring
  if (!game.state.conflict.wonCards) {
    game.state.conflict.wonCards = {}
  }
  if (!game.state.conflict.wonCards[winner.name]) {
    game.state.conflict.wonCards[winner.name] = []
  }
  game.state.conflict.wonCards[winner.name].push(conflictCard)

  // Check battle icon pair bonus (+1 VP)
  if (conflictCard.battleIcon) {
    const wonCards = game.state.conflict.wonCards[winner.name]
    const matchingIcons = wonCards.filter(c => c.battleIcon && (
      c.battleIcon === conflictCard.battleIcon
      || c.battleIcon === 'wild'
      || conflictCard.battleIcon === 'wild'
    ))
    // A pair means 2 matching icons (including the one just won)
    if (matchingIcons.length >= 2 && matchingIcons.length % 2 === 0) {
      winner.incrementCounter('vp', 1, { silent: true })
      game.log.add({
        template: '{player} matches battle icons: +1 Victory Point',
        args: { player: winner },
      })
    }
  }
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

module.exports = { combatPhase, parseRewardText }
