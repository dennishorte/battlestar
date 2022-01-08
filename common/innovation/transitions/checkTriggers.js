const { phaseFactory, nextPhase } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')

module.exports = phaseFactory({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'karma',
      func: karma
    },
  ]
})

function initialize(context) {
  const { game, actor } = context
  const { trigger } = context.data

  const triggers = game.getTriggers(actor, trigger)
  const karma = []

  for (const trigger of triggers) {
    const card = game.getCardData(trigger)
    for (const impl of card.triggerImpl) {

      // Achievement triggers are stackable.
      if (impl.kind === 'achievement') {
        util.array.pushUnique(achievements, card.id)
      }

      // Karma triggers are not stackable. The player must choose one if
      // more than one is triggered.
      else if (impl.kind === 'karma') {
        util.array.pushUnique(karma, card.id)
      }

      else {
        throw new Error(`Unknown trigger kind: ${impl.kind}`)
      }
    }
  }

  game.rk.put(context.data, 'achievementTriggers', achievements)
  game.rk.put(context.data, 'karmaTriggers', karma)

  nextPhase(context)
}

function karma(context) {

}
