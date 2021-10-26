const { transitionFactory, markDone } = require('./factory.js')


/* const steps = [
 *   'discuss',
 *   'play cards',
 *   'reveal',
 *   'post-check modifiers',
 * ] */


module.exports = transitionFactory(
  {
    step: 'discuss',
    addCardsName: '',
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const step = context.data.step

  // Initialize the skill check info in the game state
  if (!game.getSkillCheck()) {
    game.rk.sessionStart(() => {
      game.mSetSkillCheck(context.data.check)
      game.mLog({
        template: `name: ${context.data.check.name}`
      })
    })
  }

  const check = game.getSkillCheck()

  // Skill checks can end up resolved in a number of ways, not all related to
  // going through all the steps.
  if (check && check.result) {
    return context.done()
  }

  if (step === 'discuss') {
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

  else if (step === 'add cards') {
    const player = game.getPlayerByName(context.data.addCardsName)
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Skill Check - Add Cards',
        min: 0,
        options: _addCardsOptionsForPlayer(game, check, player),
      }]
    })
  }

  else {
    throw new Error(`Unknown step: ${step}`)
  }
}

function _addCardsOptionsForPlayer(game, check, player) {
  const positiveCards = []
  const negativeCards = []


  return [
    {
      name: 'Help',
      min: 0,
      max: positiveCards.length,
      options: positiveCards,
    },
    {
      name: 'Hinder',
      min: 0,
      max: negativeCards.length,
      options: negativeCards,
    },
  ]
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

function handleResponse(context) {
  const game = context.state
  const step = context.data.step
  const check = game.getSkillCheck()

  // Skill checks can end up resolved in a number of ways, not all related to
  // going through all the steps.
  if (check && check.result) {
    return context.done()
  }

  const player = game.getPlayerByName(context.response.actor)
  const action = context.response.name
  const option = context.response.option

  if (action === 'Skill Check - Discuss') {
    game.rk.sessionStart(session => {
      let start = false

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
          session.put(check.discussion[player.name], 'useScientificResearch', opt.option[0])
        }
        else if (opt.name === 'Use Investigative Committee?') {
          session.put(check.discussion[player.name], 'useInvestigativeCommitee', opt.option[0])
        }
        else if (opt.name === 'Start Skill Check') {
          start = opt.option[0]
        }
        else {
          throw new Error(`Unknown option ${opt.name}`)
        }
      }

      // If the player has submitted the "start skill check" option, let's get this party started
      if (start) {
        session.put(context.data, 'step', 'play cards')
        session.put(context.data, 'addCardsName', game.getPlayerNext().name)

        const players = game.getPlayerAll()
        let count = 0
        let player = game.getPlayerCurrentTurn()
        let scientificResearchPlayed = false
        let investigativeCommitteePlayed = false
        while (count < players.length) {
          player = game.getPlayerFollowing(player)
          count += 1

          if (
            check.discussion[player.name].useScientificResearch
            && !check.scientificResearch
          ){
            session.put(check, 'scientificResearch', true)
            game.aUseSkillCardByName(player, 'Scientific Research')
          }

          if (
            check.discussion[player.name].useInvestigativeCommitee
            && !check.investigativeCommittee
          ){
            session.put(check, 'investigativeCommittee', true)
            game.aUseSkillCardByName(player, 'Invetigative Committee')
          }
        }

        game.aAddDestinyCards()
      }
    })

    return generateOptions(context)
  }

  else if (action === 'change answer') {
    return generateOptions(context)
  }
}
