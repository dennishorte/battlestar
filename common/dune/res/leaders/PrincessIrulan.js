'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Princess Irulan',
  source: 'Uprising',
  compatibility: 'All',
  house: 'Corrino',
  startingEffect: null,
  leaderAbility: 'Imperial Birthright\nWhen you reach 2 Influence with the Emperor:\n· +1 Intrigue',
  signetRingAbility: 'Chronicler\'s Insight\nChoose one:\n· Acquire a card that costs 1 Persuasion\n· Trash a card from your hand. If it costs 1+ Persuasion: +2 Spice',
  complexity: 2,

  // Per rules.txt: "reach 2" is the upward crossing of the threshold. Fires every
  // time the player crosses from below 2 to >=2, including after losing and
  // regaining influence. Relies on `prev` passed by the leaderAbilities dispatcher.
  onGainInfluence(game, player, faction, newLevel, prev) {
    if (faction !== 'emperor') {
      return
    }
    if (prev >= 2 || newLevel < 2) {
      return
    }
    deckEngine.drawIntrigueCard(game, player, 1)
    game.log.add({
      template: '{player}: Imperial Birthright — +1 Intrigue card',
      args: { player },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    const hand = handZone.cardlist()
    const rowZone = game.zones.byId('common.imperiumRow')
    const acquirable = rowZone.cardlist().filter(c => (c.definition?.persuasionCost || 0) === 1)

    const options = ['Pass']
    if (acquirable.length > 0) {
      options.push('Acquire a card costing 1 Persuasion')
    }
    if (hand.length > 0) {
      options.push('Trash a card from hand')
    }

    if (options.length === 1) {
      return
    }

    const [choice] = game.actions.choose(player, options, {
      title: "Chronicler's Insight",
    })
    if (choice === 'Pass') {
      return
    }

    if (choice.startsWith('Acquire')) {
      const names = acquirable.map(c => c.name)
      const [pick] = game.actions.choose(player, names, {
        title: 'Acquire which card?',
      })
      const card = acquirable.find(c => c.name === pick)
      if (card) {
        deckEngine.acquireCard(game, player, card)
      }
      return
    }

    const names = hand.map(c => c.name)
    const [pick] = game.actions.choose(player, names, {
      title: 'Trash which card?',
    })
    const card = hand.find(c => c.name === pick)
    if (!card) {
      return
    }
    const cost = card.definition?.persuasionCost || 0
    deckEngine.trashCard(game, card)
    if (cost >= 1) {
      player.incrementCounter('spice', 2, { silent: true })
      game.log.add({
        template: '{player}: Chronicler\'s Insight — +2 Spice',
        args: { player },
      })
    }
  },
}
