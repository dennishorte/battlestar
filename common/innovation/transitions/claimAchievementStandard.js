const { transitionFactory2 } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'parse',
      func: parse,
    },
  ]
})

function parse(context) {
  const { game, actor } = context
  const { age, isAction } = context.data

  const card = game
    .getZoneByName('achievements')
    .cards
    .map(game.getCardData)
    .find(c => c.age === age)

  util.assert(card !== undefined, `No card matching age: ${age}`)

  return game.aClaimAchievement(context, actor, card)
}
