const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'draw',
      func: draw
    },
    {
      name: 'meld',
      func: meld
    },
    {
      name: 'returnz',
      func: returnz
    },
  ]
})

function draw(context) {
  const { game, actor } = context
  const { age } = context.data
  return game.aDraw(context, actor, age)
}

function meld(context) {
  const { game, actor } = context

  const cardToMeld = context.sentBack.card
  const playerHand = game.getHand(actor)
  const cardIsInHand = playerHand.cards.find(c => game.checkCardsEqual(c, cardToMeld))

  // When static effects from figures trigger, sometimes the cards are moved out of hand
  // before they can be meldd.
  if (cardIsInHand) {
    return game.aMeld(context, actor, cardToMeld)
  }
  else {
    game.mLog({
      template: '{card} is no longer in player hand to meld',
      args: {
        card: cardToMeld
      }
    })
  }
}

function returnz(context) {
  context.sendBack(context.sentBack)
  return context.done()
}
