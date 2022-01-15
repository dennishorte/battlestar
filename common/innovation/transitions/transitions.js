const { simpleFactory, stepFactory } = require('../../lib/transitionFactory.js')
const CardMoveFactory = require('./CardMoveFactory.js')

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

  'action-decree': require('./actionDecree.js'),

  'action-dogma': require('./actionDogma.js'),
  'action-dogma-one-effect': require('./actionDogmaOneEffect.js'),
  'action-dogma-one-step': require('./actionDogmaOneStep.js'),

  'action-draw': require('./actionDraw.js'),
  'raw-draw': require('./rawDraw.js'),

  'action-endorse': require('./actionEndorse.js'),
  'action-inspire': require('./actionInspire.js'),

  'action-meld': require('./actionMeld.js'),

  'achievement-check': require('./achievementCheck.js'),
  'check-karma': require('./checkKarma.js'),
  'claim-achievement-standard': require('./claimAchievementStandard.js'),
  'choose': require('./choose.js'),
  'choose-and-splay': require('./chooseAndSplay.js'),
  'draw-and-forecast': require('./drawAndForecast.js'),
  'draw-and-meld': require('./drawAndMeld.js'),
  'draw-and-score': require('./drawAndScore.js'),
  'draw-many': require('./drawMany.js'),
  'transfer-cards': require('./transferCards.js'),
  'remove-many': require('./removeMany.js'),
  'return-many': require('./returnMany.js'),
  'splay': require('./splay.js'),

  'claim-achievement': CardMoveFactory('claim-achievement', 'mClaimAchievement'),
  'forecast': CardMoveFactory('forecast', 'mForecast'),
  'meld': CardMoveFactory('meld', 'mMeld'),
  'remove': CardMoveFactory('remove', 'mRemove'),
  'return': CardMoveFactory('return', 'mReturn'),
  'return-achievement': CardMoveFactory('return', 'mReturnAchievement'),
  'score': CardMoveFactory('score', 'mScore'),
}

module.exports = transitions
