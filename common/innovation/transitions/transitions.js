const { simpleFactory, stepFactory } = require('../../lib/transitionFactory.js')

const transitions = {
  root: {
    func: stepFactory([
      'initialize',
      'first-picks',
      'main-loop',
      'END'
    ]),
  },

  'initialize': require('./initialize.js'),
  'first-picks': require('./firstPicks.js'),
  'main-loop': require('./main.js'),
  'player-turn': require('./playerTurn.js'),

  'action-achieve': require('./actionAchieve.js'),
  'action-decree': require('./actionDecree.js'),
  'action-dogma': require('./actionDogma.js'),
  'action-draw': require('./actionDraw.js'),
  'action-endorse': require('./actionEndorse.js'),
  'action-inspire': require('./actionInspire.js'),
  'action-meld': require('./actionMeld.js'),
}

module.exports = transitions
