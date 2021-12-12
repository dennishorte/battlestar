const { transitionFactory, markDone } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const options = _getPresidentialCandidates(context)
  return context.wait({
    actor: context.data.playerName,
    name: 'Choose a Player',
    options,
  })
}

function _getPresidentialCandidates(context) {
  const game = context.state
  const vicePresident = game.getVicePresident()

  if (vicePresident && !game.checkPlayerIsPresident(vicePresident)) {
    return [vicePresident.name]
  }

  else {
    return game
      .getPlayerAll()
      .filter(p => p.name !== context.data.playerName)
      .filter(p => p.name !== game.getPlayerPresident().name)
      .filter(p => !game.checkPlayerIsRevealedCylon(p))
      .map(p => p.name)
  }
}

function handleResponse(context) {
  const game = context.state

  const chosenPlayerName = context.response.option[0]
  const chosenPlayer = game.getPlayerByName(chosenPlayerName)

  let passValue = 7

  if (game.checkEffect('Accept Prophecy')) {
    passValue += 2
    const acceptProphecyCard = game.getCardByName('Accept Prophecy')
    game.mDiscard(acceptProphecyCard)
  }

  game.mSetSkillCheck({
    name: `Nominate ${chosenPlayerName} for the Presidency`,
    skills: ['leadership', 'tactics'],
    passValue,
    partialValue: 0,
    passEffect: `${chosenPlayerName} becomes the President`,
    partialEffect: '',
    failEffect: '',
    script: {
      pass: [{
        kind: 'title',
        title: 'President',
        assignTo: chosenPlayerName,
      }],
      fail: [],
    }
  })
  markDone(context)
  return context.push('skill-check')
}