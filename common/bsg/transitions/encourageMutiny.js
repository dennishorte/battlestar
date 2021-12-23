const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'chooseCandidate',
      func: _chooseCandidate,
      resp: _testCandidate,
    },
  ],
})

function _chooseCandidate(context) {
  const game = context.state
  const candidates = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsAdmiral(p))
    .map(p => p.name)
    .sort()

  return context.wait({
    actor: context.data.playerName,
    name: 'Choose Replacement Admiral',
    options: candidates,
  })
}

function _testCandidate(context) {
  const game = context.state
  const candidateName = bsgutil.optionName(context.response.option[0])

  // Possibly reduce population
  const dieRoll = game.mRollDie()
  if (dieRoll <= 2) {
    game.mLog({
      template: "{player}'s attempted mutiny failed",
      args: {
        player: candidateName
      }
    })
  }
  else {
    game.mLog({
      template: "{player}'s mutiny succeeds",
      args: {
        player: candidateName
      }
    })
    game.aAssignAdmiral(candidateName)
  }

  // Discard the quorum card
  const card = game.getCardByName('Encourage Mutiny')
  game.mDiscard(card)
}
