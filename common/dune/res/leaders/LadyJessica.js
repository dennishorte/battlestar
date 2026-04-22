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
          const choices = ['Pass', `Return ${memories} Memories → Draw ${memories} cards and flip Leader`]
          const [choice] = game.actions.choose(player, choices, {
            title: 'Lady Jessica: Activate Other Memories?',
          })
          if (choice !== 'Pass') {
            player.incrementCounter('troopsInSupply', memories, { silent: true })
            game.state.jessicaMemories[player.name] = 0
            deckEngine.drawCards(game, player, memories)
            game.state.jessicaFlipped[player.name] = true
            game.log.add({
              template: '{player}: Other Memories — returns {count} Memories, draws {count} cards, becomes Reverend Mother',
              args: { player, count: memories },
            })
          }
        }
      }
    }
    else {
      if ((space.icon === 'bene-gesserit' || space.icon === 'fremen') && player.water >= 1) {
        if (!game.state.turnTracking?.jessicaUsedRepeat) {
          const choices = ['Pass', `Pay 1 Water to repeat ${space.name} effects`]
          const [choice] = game.actions.choose(player, choices, {
            title: 'Reverend Mother: Repeat board space effects?',
          })
          if (choice !== 'Pass') {
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
        const choices = ['Pass', 'Spice Agony (1 Spice → 1 Intrigue + 1 Memory)']
        const [choice] = game.actions.choose(player, choices, {
          title: 'Lady Jessica: Activate Spice Agony?',
        })
        if (choice !== 'Pass') {
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
