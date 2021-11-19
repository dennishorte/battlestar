const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {
    consideredDeclareEmergency: false,
  },
  generateOptions,
  () => { throw new Error('No responses to handle in skill-check-post-reveal') }
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()

  _initializeSkillCheckResult(game, check)

  // Declare Emergency
  if (!context.data.consideredDeclareEmergency) {
    game.rk.sessionStart(session => {
      session.put(context.data, 'consideredDeclareEmergency', true)
    })
    return context.push('skill-check-declare-emergency')
  }

  _finalizeSkillCheck(game, check)

  return context.done()
}

function _initializeSkillCheckResult(game, check) {
  if (check.cardsAdded.length === 0) {
    const poolCards = game.getZoneByName('crisisPool').cards

    // Copy over the card data as a record of this skill check
    // Guaranteed to always have some cards, because of the destiny cards
    const data = [...poolCards]
      .sort((l, r) => (
        l.skill.localeCompare(r.skill)
        || l.name.localeCompare(r.name)
        || l.value - r.value
      ))
      .map(c => c.id)

    game.rk.sessionStart(session => {
      session.put(check, 'cardsAdded', data)
      session.put(check, 'total', bsgutil.calculateCheckValue(poolCards, check))

      // Reveal the cards in the crisis pool
      for (const card of game.getZoneByName('crisisPool').cards) {
        session.put(card, 'visibility', game.getPlayerAll().map(p => p.name))
      }
    })
  }
}

function _finalizeSkillCheck(game, check) {
  const poolCards = game.getZoneByName('crisisPool').cards
  const finalValue = bsgutil.calculateCheckValue(poolCards, check)
  const resultString = finalValue >= check.passValue
                     ? 'pass'
                     : (check.partialValue && finalValue >= check.partialValue
                      ? 'partial'
                      : 'fail')

  game.rk.sessionStart(session => {
    session.put(check, 'total', finalValue)
    session.put(check, 'result', resultString)
    game.mLog({
      template: 'Skill check result is: {skillCheckResult}',
      args: {
        skillCheckResult: resultString
      }
    })
  })
}
