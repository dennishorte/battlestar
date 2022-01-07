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
  'action-dogma-one-effect': require('./actionDogmaOneEffect.js'),
  'action-dogma-one-step': require('./actionDogmaOneStep.js'),

  'action-draw': require('./actionDraw.js'),
  'raw-draw': require('./rawDraw.js'),

  'action-endorse': require('./actionEndorse.js'),
  'action-inspire': require('./actionInspire.js'),

  'action-meld': require('./actionMeld.js'),
  'raw-meld': require('./rawMeld.js'),

  'choose-cards': require('./chooseCards.js'),
  'claim-achievement': require('./claimAchievement.js'),
  'draw-and-meld': require('./drawAndMeld.js'),
  'draw-and-score': require('./drawAndScore.js'),
  'transfer-cards': require('./transferCards.js'),
  'score': require('./score.js'),
}

module.exports = transitions
