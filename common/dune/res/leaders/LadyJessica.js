'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Lady Jessica',
  source: 'Uprising',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Other Memories\nWhen you send an Agent to a Bene Gesserit board space:\n· Return all your memories to your supply\n· Draw a card for each one\n· Flip this Leader over',
  signetRingAbility: 'Spice Agony\nPay 1 Spice:\n· +1 Intrigue card\n· Move a troop from your supply to the BG area (becomes a memory)',
  complexity: 2,
  flippedName: 'Reverend Mother',
  flippedLeaderAbility: 'Voice of Memory\nWhen you send an Agent to a Bene Gesserit or Fremen board space:\n· Pay 1 Water to repeat that space\'s effects',
  flippedSignetRingAbility: 'Water of Life\nPay 1 Spice:\n· +1 Water',

  onAssign(game, _player) {
    if (!game.state.jessicaMemories) {
      game.state.jessicaMemories = {}
    }
    if (!game.state.jessicaFlipped) {
      game.state.jessicaFlipped = {}
    }
    game.state.jessicaMemories[_player.name] = 0
    game.state.jessicaFlipped[_player.name] = false
  },

  onAgentPlaced(game, player, space, resolveBoardSpaceEffectsFn) {
    const isFlipped = game.state.jessicaFlipped?.[player.name]

    if (!isFlipped) {
      if (space.icon === 'bene-gesserit') {
        const memories = game.state.jessicaMemories?.[player.name] || 0
        if (memories > 0) {
          player.incrementCounter('troopsInSupply', memories, { silent: true })
          game.state.jessicaMemories[player.name] = 0
          deckEngine.drawCards(game, player, memories)
        }
        game.state.jessicaFlipped[player.name] = true
        game.log.add({
          template: memories > 0
            ? '{player}: Other Memories — returns {count} Memories, draws {count} cards, becomes Reverend Mother'
            : '{player}: Other Memories — becomes Reverend Mother',
          args: { player, count: memories },
        })
      }
    }
    else {
      if ((space.icon === 'bene-gesserit' || space.icon === 'fremen') && player.water >= 1) {
        if (!game.state.turnTracking?.jessicaUsedRepeat) {
          const choices = [
            game.actions.option({ id: 'pass', title: 'Pass' }),
            game.actions.option({ id: 'repeat', title: `Pay 1 Water to repeat ${space.name} effects` }),
          ]
          const [choice] = game.actions.choose(player, choices, {
            title: 'Reverend Mother: Repeat board space effects?',
          })
          const chId = typeof choice === 'object' ? choice.id : choice
          if (chId !== 'pass' && choice !== 'Pass') {
            player.decrementCounter('water', 1, { silent: true })
            game.log.add({
              template: '{player}: Reverend Mother — pays 1 Water, repeats {space} effects',
              args: { player, space: space.name },
            })
            if (game.state.turnTracking) {
              game.state.turnTracking.jessicaUsedRepeat = true
            }
            resolveBoardSpaceEffectsFn(game, player, space)
          }
        }
      }
    }
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const isFlipped = game.state.jessicaFlipped?.[player.name]
    if (!isFlipped) {
      if (player.spice >= 1 && player.troopsInSupply > 0) {
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          game.actions.option({ id: 'agony', title: 'Spice Agony (1 Spice → 1 Intrigue + 1 Memory)' }),
        ]
        const [choice] = game.actions.choose(player, choices, {
          title: 'Lady Jessica: Activate Spice Agony?',
        })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          player.decrementCounter('spice', 1, { silent: true })
          deckEngine.drawIntrigueCard(game, player, 1)
          player.decrementCounter('troopsInSupply', 1, { silent: true })
          game.state.jessicaMemories[player.name]++
          game.log.add({
            template: '{player}: Spice Agony — pays 1 Spice, draws Intrigue, troop becomes a Memory ({count} total)',
            args: { player, count: game.state.jessicaMemories[player.name] },
          })
        }
      }
    }
    else {
      if (player.spice >= 1) {
        player.decrementCounter('spice', 1, { silent: true })
        player.incrementCounter('water', 1, { silent: true })
        game.log.add({
          template: '{player}: Water of Life — pays 1 Spice, gains 1 Water',
          args: { player },
        })
      }
    }
  },
}
