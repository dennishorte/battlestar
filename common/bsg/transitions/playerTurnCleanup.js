const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state

  // Check if the humans have run out of a critial resource
  if (game.getCounterByName('fuel') <= 0) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has run out of fuel. Stranded, they are easy prey for the Cylons.',
      'cylons'
    )
  }
  if (game.getCounterByName('food') <= 0) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has run out of food. As their strength flags, the Cylons slowly picks off more and more of them until they are gone.',
      'cylons'
    )
  }
  if (game.getCounterByName('morale') <= 0) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has run out of morale. Lacking the spirit to go on, the fleet slowly drifts apart to be picked off one by one.',
      'cylons'
    )
  }
  if (game.getCounterByName('population') <= 0) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has been picked apart. The last few remaining humans, aboard the Galactica, make a futile last stand against the Cylons.',
      'cylons'
    )
  }

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
