const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  () => { throw new Error('No responses needed in jump-the-fleet') }
)

function generateOptions(context) {
  const game = context.state

  const jumpTrack = game.getCounterByName('jumpTrack')

  // Ensure it is possible to jump
  if (jumpTrack < 2) {
    game.mLog({ template: 'It is not possible to jump when the Jump Track is so low' })
    return context.done()
  }

  // Check if this is the victory jump
  if (game.getCounterByName('distance') >= 8) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has reached Kobol and safety.',
      'humans',
    )
  }

  // Clean up anything in space
  game.aClearSpace()

  // Check if any population is lost
  if (jumpTrack === 2 || jumpTrack === 3) {
    const dieRoll = bsgutil.rollDie()
    if (dieRoll <= 6) {
      const amount = jumpTrack === 2 ? 3 : 1
      game.mLog({
        template: 'Not all of the civilian ships were ready to jump. {amount} {counter} lost.',
        args: {
          amount,
          counter: 'population',
        }
      })
      game.mAdjustCounterByName('population', -amount)
    }
  }

  // Chooses a destination
  markDone(context)
  return context.push('jump-choose-destination')
}
