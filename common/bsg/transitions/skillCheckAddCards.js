const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {
    addCardsName: '',
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()

  // Initialize
  if (!context.data.playerName) {
    _beginAddCardsPhase(context)
  }

  const player = game.getPlayerByName(context.data.addCardsName)
  return context.wait({
    actor: player.name,
    actions: [{
      name: 'Skill Check - Add Cards',
      min: 1,
      options: _addCardsOptionsForPlayer(game, check, player),
    }]
  })
}

function handleResponse(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const player = game.getPlayerByName(context.response.actor)
  const addCards = check.addCards[player.name]
  const option = context.response.option

  game.rk.sessionStart(session => {
    session.put(addCards, 'submitted', true)

    for (const opt of option) {

      if (opt === 'Do Nothing') {
        // do nothing
      }

      else if (opt === 'Use Declare Emergency') {
        session.put(addCards, 'useDeclareEmergency', true)
      }

      else if (opt.name === 'Help' || opt.name === 'Hinder') {
        session.put(addCards, 'numAdded', numCards.numAdded + opt.option.length)
        for (const card of opt.option) {
          game.mAddCardToCrisisPool(card)
        }
      }

      else {
        throw new Error(`Unhandled option in Skill Check - Add Cards: ${option}`)
      }
    }

    game.mLog({
      template: '{player} added {count} cards',
      args: {
        player: player.name,
        count: addCards.numAdded,
      },
    })

    if (player.name === game.getPlayerCurrentTurn().name) {
      session.put(context.data, 'step', 'post reveal')
    }
    else {
      session.put(context.data, 'addCardsName', game.getPlayerFollowing(player).name)
    }
  })

  return generateOptions(context)
}

function _beginAddCardsPhase(context) {
  const game = context.state
  const check = game.getSkillCheck()

  game.rk.sessionStart(session => {
    // Play queued cards
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

    // Set the first player to play cards
    session.put(context.data, 'addCardsName', game.getPlayerNext().name)
  })
}

function _addCardsOptionsForPlayer(game, check, player) {
  const positiveCards = []
  const negativeCards = []


  const options = [
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

  if (game.checkPlayerHasCardByName(player, 'Declare Emergency')) {
    options.push('Use Declare Emergency')
  }

  options.push({
    name: 'Do Nothing',
    exclusive: true,
  })

  return options
}
