const { transitionFactory } = require('./factory.js')
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

  let nextStep = false

  game.rk.sessionStart(session => {
    for (const opt of option) {
      if (opt.name === 'Change Answer') {
        session.put(check.discussion, player.name, {
          support: '',
          useScientificResearch: false,
          useInvestigativeCommitee: false,
        })
        break
      }
      else if (opt.name === 'How much can you help?') {
        session.put(check.discussion[player.name], 'support', opt.option[0])
      }
      else if (opt.name === 'Use Scientific Research?') {
        const use = opt.option[0] === 'yes'
        session.put(check.discussion[player.name], 'useScientificResearch', use)
      }
      else if (opt.name === 'Use Investigative Committee?') {
        const use = opt.option[0] === 'yes'
        session.put(check.discussion[player.name], 'useInvestigativeCommitee', use)
      }
      else if (opt.name === 'Start Skill Check') {
        nextStep = (opt.option[0] === 'yes')
      }
      else {
        throw new Error(`Unknown option ${opt.name}`)
      }
    }
  })

  if (nextStep) {
    return context.done()
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
      options.push({
        name: 'Use Scientific Research?',
        options: ['yes', 'no'],
        default: 'no',
      })
    }

    if (playerHasInvestigativeCommittee) {
      options.push({
        name: 'Use Investigative Committee',
        options: ['yes', 'no'],
        default: 'no',
      })
    }
  }

  // Player already responded; allow them to undo
  else {
    options.push({
      name: 'Change Answer',
      options: ['yes']
    })
  }

  if (player.name === game.getPlayerCurrentTurn().name) {
    options.push({
      name: 'Start Skill Check',
      option: ['yes', 'no'],
      default: 'no',
    })
  }

  return options
}
