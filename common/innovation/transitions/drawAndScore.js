const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'draw',
      func: draw
    },
    {
      name: 'score',
      func: score
    }
  ]
})

function draw(context) {
  const { game, actor } = context
  const { age } = context.data
  return game.aDraw(context, actor, age)
}

function score(context) {
  const { game, actor } = context
  const { returned } = context.data

  const cardToScore = returned[0]
  const playerHand = game.getHand(actor)
  const cardIsInHand = playerHand.cards.find(c => game.checkCardsEqual(c, cardToScore))

  // When static effects from figures trigger, sometimes the cards are moved out of hand
  // before they can be scored.
  if (cardIsInHand) {
    return game.aScore(context, actor, cardToScore)
  }
  else {
    game.mLog({
      template: '{card} is no longer in player hand to score',
      args: {
        card: cardToScore
      }
    })
  }
}
