const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const waits = game.getPlayerAll().map(player => {
    return {
      actor: player.name,
      actions: [{
        name: 'Skill Check - Discuss',
        options: _discussOptionsForPlayer(game, check, player),
      }],
    }
  })

  return context.waitMany(waits)
}

function handleResponse(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const player = game.getPlayerByName(context.response.actor)
  const action = context.response.name
  const option = context.response.option

  util.assert(action === 'Skill Check - Discuss', `Unexpected action: ${action}`)

  let nextStep = ''

  game.rk.sessionStart(session => {
    for (const opt of option) {
      const name = (typeof opt === 'string') ? opt : opt.name

      if (name === 'Change Answer') {
        session.put(check.discussion, player.name, {
          support: '',
          useScientificResearch: false,
          useInvestigativeCommitee: false,
        })
        break
      }
      else if (name === 'How much can you help?') {
        session.put(check.discussion[player.name], 'support', opt.option[0])
      }
      else if (name === 'Use Scientific Research?') {
        session.put(check.discussion[player.name], 'useScientificResearch', true)
      }
      else if (name === 'Use Investigative Committee?') {
        session.put(check.discussion[player.name], 'useInvestigativeCommitee', true)
      }
      else if (name === 'Start Skill Check') {
        nextStep = 'done'
      }
      else if (name === 'Choose Option 2') {
        nextStep = 'option2'
      }
      else {
        throw new Error(`Unknown option ${opt.name}`)
      }
    }
  })

  if (nextStep === 'done') {
    return context.done()
  }
  else if (nextStep === 'option2') {
    markDone(context)
    return context.push('evaluate-card-effects', {
      cardId: check.id,
      effectKey: 'option2'
    })
  }
  else {
    return generateOptions(context)
  }
}

function _discussOptionsForPlayer(game, check, player) {
  const options = []

  // Player hasn't responded yet
  if (!check.discussion[player.name].support) {
    const playerHasScientificResearch =
      game.checkPlayerHasCardByName(player, 'Scientific Research')

    const playerHasInvestigativeCommittee =
      game.checkPlayerHasCardByName(player, 'Investigative Committee')

    options.push({
      name: 'How much can you help?',
      options: ['none', 'a little', 'some', 'a lot'],
    })

    if (playerHasScientificResearch) {
      options.push('Use Scientific Research?')
    }

    if (playerHasInvestigativeCommittee) {
      options.push('Use Investigative Committee')
    }
  }

  // Player already responded; allow them to undo
  else {
    options.push('Change Answer')
  }

  if (check.option2 && player.name === game.getPlayerByDescriptor(check.actor)) {
    options.push('Start Skill Check')
    options.push({
      name: 'Choose Option 2',
      exclusive: true,
    })
  }

  else if (player.name === game.getPlayerCurrentTurn().name) {
    options.push('Start Skill Check')
  }

  return options
}