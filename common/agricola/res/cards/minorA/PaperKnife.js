const util = require('../../../../lib/util')

module.exports = {
  id: "paper-knife-a003",
  name: "Paper Knife",
  deck: "minorA",
  number: 3,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupationsInHand: 3 },
  category: "Actions Booster",
  text: "Select 3 occupations in your hand. Select one of them randomly, which you can play immediately without paying an occupation cost.",
  onPlay(game, player) {
    const occupationsInHand = player.hand.filter(cardId => {
      const card = game.cards.byId(cardId)
      return card && card.type === 'occupation'
    })

    if (occupationsInHand.length === 0) {
      return
    }

    let selectedIds
    if (occupationsInHand.length <= 3) {
      selectedIds = occupationsInHand
    }
    else {
      const choices = occupationsInHand.map(cardId => {
        const card = game.cards.byId(cardId)
        return card.name
      })
      const selection = game.actions.choose(player, choices, {
        title: 'Paper Knife: Select 3 occupations',
        min: 3,
        max: 3,
      })
      selectedIds = selection.map(name => {
        return occupationsInHand.find(id => game.cards.byId(id).name === name)
      })
    }

    // Randomly select one of the three
    const chosenId = util.array.select(selectedIds, game.random)
    const card = game.cards.byId(chosenId)

    // Play for free (no occupation food cost)
    player.playCard(chosenId)
    game.actions._recordCardPlayed(player, card)

    game.log.add({
      template: '{player} plays {card} for free (Paper Knife)',
      args: { player, card },
    })

    if (card.hasHook('onPlay')) {
      card.callHook('onPlay', game, player)
    }

    game.registerCardActionSpace(player, card)
    game.callPlayerCardHook(player, 'onPlayOccupation')
  },
}
