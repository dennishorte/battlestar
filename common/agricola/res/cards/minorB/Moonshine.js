const util = require('../../../../lib/util')

module.exports = {
  id: "moonshine-b003",
  name: "Moonshine",
  deck: "minorB",
  number: 3,
  type: "minor",
  cost: {},
  prereqs: { occupationsInHand: 1 },
  category: "Actions Booster",
  text: "Determine a random occupation in your hand. Immediately play it for an occupation cost of 2 food or give it to the player to your left.",
  onPlay(game, player) {
    const card = this
    const occupationsInHand = player.hand.filter(cardId => {
      const c = game.cards.byId(cardId)
      return c && c.type === 'occupation'
    })

    if (occupationsInHand.length === 0) {
      return
    }

    const chosenId = util.array.select(occupationsInHand, game.random)
    const chosenCard = game.cards.byId(chosenId)

    const choices = [`Play ${chosenCard.name} for 2 food`, `Give ${chosenCard.name} to left player`]
    const selection = game.actions.choose(player, choices, {
      title: `${card.name}: Play or pass the occupation?`,
      min: 1,
      max: 1,
    })

    if (selection[0].startsWith('Play')) {
      player.payCost({ food: 2 })
      player.playCard(chosenId)
      game.actions._recordCardPlayed(player, chosenCard)

      game.log.add({
        template: '{player} plays {card} for 2 food (Moonshine)',
        args: { player, card: chosenCard },
      })

      if (chosenCard.hasHook('onPlay')) {
        chosenCard.callHook('onPlay', game, player)
      }

      game.registerCardActionSpace(player, chosenCard)
      game.callPlayerCardHook(player, 'onPlayOccupation', chosenCard)
    }
    else {
      const leftPlayer = game.players.leftOf(player)
      const leftHandZone = game.zones.byPlayer(leftPlayer, 'hand')
      chosenCard.moveTo(leftHandZone)

      game.log.add({
        template: '{player} gives {card} to {playerNext} (Moonshine)',
        args: { player, card: chosenCard, playerNext: leftPlayer },
      })
    }
  },
}
