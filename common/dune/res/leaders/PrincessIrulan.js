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

  onGainInfluence(game, player, faction, newLevel) {
    if (faction !== 'emperor' || newLevel < 2) {
      return
    }
    if (!game.state.leaderBonusTriggered) {
      game.state.leaderBonusTriggered = {}
    }
    const key = `${player.name}-Princess Irulan-emperor`
    if (game.state.leaderBonusTriggered[key]) {
      return
    }
    game.state.leaderBonusTriggered[key] = true
    deckEngine.drawIntrigueCard(game, player, 1)
    game.log.add({
      template: '{player}: Imperial Birthright — +1 Intrigue card',
      args: { player },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    const hand = handZone.cardlist()
    const trashable = hand.filter(c => (c.definition?.persuasionCost || 0) >= 1)

    const options = []
    const rowZone = game.zones.byId('common.imperiumRow')
    const rowCards = rowZone.cardlist().filter(c => (c.definition?.persuasionCost || 0) <= 1)
    if (rowCards.length > 0) {
      options.push('Acquire a card costing 1 Persuasion or less')
    }
    if (trashable.length > 0) {
      options.push('Trash a card from hand (1+ cost) → +2 Spice')
    }
    if (options.length === 0) {
      return
    }

    const [choice] = game.actions.choose(player, options, {
      title: "Chronicler's Insight",
    })
    if (choice.startsWith('Acquire')) {
      const names = rowCards.map(c => c.name)
      const [pick] = game.actions.choose(player, names, {
        title: 'Acquire which card?',
      })
      const card = rowCards.find(c => c.name === pick)
      if (card) {
        const discard = game.zones.byId(`${player.name}.discard`)
        card.moveTo(discard)
        deckEngine.refillImperiumRow(game)
        game.log.add({
          template: '{player}: Chronicler\'s Insight — acquires {card}',
          args: { player, card: pick },
        })
      }
    }
    else {
      const names = trashable.map(c => c.name)
      const [pick] = game.actions.choose(player, names, {
        title: 'Trash which card?',
      })
      const card = trashable.find(c => c.name === pick)
      if (card) {
        deckEngine.trashCard(game, card)
        player.incrementCounter('spice', 2, { silent: true })
        game.log.add({
          template: '{player}: Chronicler\'s Insight — trashes {card}, +2 Spice',
          args: { player, card: pick },
        })
      }
    }
  },
}
