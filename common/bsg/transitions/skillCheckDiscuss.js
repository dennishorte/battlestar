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

  // Mostly a result of testing
  if (check.result) {
    return context.done()
  }

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
  const flags = check.flags[player.name]

  // Mostly a result of testing
  if (check.result) {
    return context.done()
  }

  util.assert(action === 'Skill Check - Discuss', `Unexpected action: ${action}`)

  let nextStep = ''

  game.rk.sessionStart(session => {
    for (const opt of option) {
      const name = (typeof opt === 'string') ? opt : opt.name

      if (name === 'Change Answer') {
        session.put(flags.submitted, 'discussion', false)
        session.put(flags, 'useScientificResearch', false)
        session.put(flags, 'useInvestigativeCommitee', false)
        session.put(flags, 'support', '')
        break
      }
      else {
        session.put(flags.submitted, 'discussion', true)

        if (name === 'How much can you help?') {
          session.put(flags, 'support', opt.option[0])
        }
        else if (name === 'Use Scientific Research') {
          session.put(flags, 'useScientificResearch', true)
        }
        else if (name === 'Use Investigative Committee') {
          session.put(flags, 'useInvestigativeCommitee', true)
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
    }
  })

  const allPlayersHaveSubmitted = game
    .getPlayerAll()
    .every(p => check.flags[p.name].submitted.discuss)

  if (nextStep === 'option2') {
    markDone(context)
    return context.push('evaluate-effects', {
      name: `${check.name} option 2`,
      effects: check.script.option2,
    })
  }
  else if (nextStep === 'done' || allPlayersHaveSubmitted) {
    return context.done()
  }
  else {
    return generateOptions(context)
  }
}

function _discussOptionsForPlayer(game, check, player) {
  const flags = check.flags[player.name]
  const options = []

  // Player hasn't responded yet
  if (!flags.submitted.discussion) {
    const playerHasScientificResearch =
      game.checkPlayerHasCardByName(player, 'Scientific Research')

    const playerHasInvestigativeCommittee =
      game.checkPlayerHasCardByName(player, 'Investigative Committee')

    options.push({
      name: 'How much can you help?',
      options: ['none', 'a little', 'some', 'a lot'],
    })

    if (playerHasInvestigativeCommittee) {
      options.push({
        name: 'Use Investigative Committee',
        description: 'All cards will be played face up during this skill check',
        extra: true,
      })
    }

    if (
      playerHasScientificResearch
      // Scientific Research is pointless if engineering is already a skill in the check
      && !check.skills.includes('engineering')
    ) {
      options.push({
        name: 'Use Scientific Research',
        description: 'All engineering (blue) cards will be positive for this check',
        extra: true,
      })
    }
  }

  // Player already responded; allow them to undo
  else {
    options.push('Change Answer')
  }

  if (player.name === game.getPlayerCurrentTurn().name) {
    options.push({
      name: 'Start Skill Check',
      description: 'Begin the skill check even though not everyone has answered yet',
      extra: true,
    })
  }

  if (check.option2 && player.name === game.getPlayerByDescriptor(check.actor).name) {
    options.push({
      name: 'Choose Option 2',
      exclusive: true,
    })
  }

  return options
}
