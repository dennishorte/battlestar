const { transitionFactory } = require('./factory.js')
const util = require('../../lib/util.js')

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
  if (!context.data.addCardsName) {
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
        session.put(addCards, 'numAdded', addCards.numAdded + opt.option.length)
        for (const cardOpt of opt.option) {
          const tokens = cardOpt.split(',')
          util.assert(tokens.length === 2, `Unknown card option: ${cardOpt}`)

          const cardName = tokens[0]
          const cardValue = parseInt(tokens[1])
          const playerHand = game.getZoneByPlayer(player)
          const card = playerHand.cards.find(c => c.name === cardName && c.value === cardValue)

          util.assert(!!card, `Card not found in player hand: ${cardOpt}`)

          game.mMoveCard(playerHand, 'crisisPool', card)
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

    session.put(context.data, 'addCardsName', game.getPlayerFollowing(player).name)
  })

  if (player.name === game.getPlayerCurrentTurn().name) {
    return context.done()
  }
  else {
    return generateOptions(context)
  }
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

  for (const card of game.getCardsKindByPlayer('skill', player)) {
    const optionName = `${card.name},${card.value}`
    if (_cardHelps(check, card)) {
      positiveCards.push(optionName)
    }
    else {
      negativeCards.push(optionName)
    }
  }

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

  if (game.checkPlayerIsAtLocation(player, 'Brig')) {
    for (const opt of options) {
      opt.max = 1
      opt.exclusiveKey = 'skill-cards'
    }
  }

  if (game.checkPlayerHasCardByName(player, 'Declare Emergency')) {
    options.push('Use Declare Emergency')
  }

  options.push({
    name: 'Do Nothing',
    exclusive: true,
  })

  return options
}

function _cardHelps(check, card) {
  return (
    check.skills.includes(card.skill)
    || (check.scientificResearch && card.skill === 'engineering')
  )
}