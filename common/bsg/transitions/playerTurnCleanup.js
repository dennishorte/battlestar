const { transitionFactory, markDone } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state

  const playersNeedingToDiscard = game
    .getPlayerAll()
    .map(p => ({
      player: p.name,
      count: game.getCardsKindByPlayer('skill', p).length - game.getHandLimit(p),
    }))
    .filter(p => p.count > 0)

  if (playersNeedingToDiscard.length > 0) {
    markDone(context)
    context.push('discard-skill-cards', {
      countsByPlayer: playersNeedingToDiscard
    })
  }
  else {
    context.done()
  }
}

function handleResponse(context) {

}
