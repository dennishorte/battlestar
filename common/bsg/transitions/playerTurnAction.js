const bsgutil = require('../util.js')
const util = require('../../lib/util.js')
const { transitionFactory, markDone } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (game.getRound() === 1 && character.name === 'Karl "Helo" Agathon') {
    game.mLog({
      template: "{player} can't take an action on the first round because Helo is stranded",
      args: {
        player: player.name,
      }
    })
    return context.done()
  }

  const options = []
  _addLocationActions(context, options)
  _addSkillCardActions(context, options)
  _addQuorumActions(context, options)
  _addOncePerGameActions(context, options)
  _addLoyaltyActions(context, options)

  if (options.length === 0) {
    return context.done()
  }

  else {
    options.push('Skip Action')
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Action',
        options
      }]
    })
  }
}

function handleResponse(context) {
  util.assert(
    context.response.name === 'Action',
    `Got unexpected response name: ${context.response.name}`
  )
  util.assert(
    context.response.option.length === 1,
    `Got more than one selected option in response for Action`
  )

  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const selection = context.response.option[0]
  const selectionName = bsgutil.optionName(selection)

  if (selectionName === 'Skip Action') {
    game.mLog({
      template: '{player} decides not to take an action',
      args: {
        player: player.name
      }
    })
    context.done()
  }

  else if (selectionName === 'Play Skill Card') {
    const cardName = bsgutil.optionName(selection.option[0])

    if (cardName === 'Executive Order') {
      return context.push('skill-card-executive-order', {
        playerName: player.name
      })
    }

    else {
      throw new Error(`Unhanlded skill action: ${cardname}`)
    }
  }

  else if (selectionName === 'Location Action') {
    const locationName = bsgutil.optionName(selection.option[0])

    game.mLog({
      template: '{player} uses {location}',
      args: {
        player: player.name,
        location: locationName,
      }
    })

    ////////////////////
    // Galactica

    if (locationName === "Admiral's Quarters") {
      markDone(context)
      return context.push('activate-admirals-quarters', {
        playerName: player.name,
      })
    }

    else if (locationName === 'Armory') {
      game.aAttackCenturion()
      return context.done()
    }

    else if (locationName === 'FTL Control') {
      markDone(context)
      return context.push('jump-the-fleet')
    }

    else if (locationName === 'Research Lab') {
      markDone(context)
      return context.push('draw-skill-cards', {
        playerName: player.name,
        reason: 'Research Lab'
      })
    }

    ////////////////////
    // Colonial One

    else if (locationName === 'Administration') {
      markDone(context)
      return context.push('activate-administration', {
        playerName: player.name
      })
    }

    else if (locationName === "President's Office") {
      markDone(context)
      return context.push('activate-presidents-office', {
        playerName: player.name
      })
    }

    else if (locationName === 'Press Room') {
      game.aDrawSkillCards(player, ['politics', 'politics'])
      return context.done()
    }

    else {
      throw new Error(`Unhandled location action: ${locationName}`)
    }
  }

  else {
    throw new Error(`Unhandled Action: ${selection.name}`)
  }
}

const actionSkillCards = [
  'Consolidate Power',
  'Executive Order',
  'Launch Scout',
  'Maximum Firepower',
  'Repair',
]

function _addSkillCardActions(context, options) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const cardNames = game.getCardsKindByPlayer('skill', player).map(c => c.name)

  const cardOptions = []

  for (const name of actionSkillCards) {
    if (cardNames.includes(name)) {
      cardOptions.push(name)
    }
  }

  if (cardOptions) {
    options.push({
      name: 'Play Skill Card',
      max: 1,
      options: cardOptions,
    })
  }
}

function _addLocationActions(context, options) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const location = game.getZoneByPlayerLocation(player)

  if (
    location.name.startsWith('location')
    && !game.checkPlayerIsAtLocation(player, 'Brig')
    && !game.checkPlayerIsAtLocation(player, 'Sickbay')
    && !game.checkLocationIsDamaged(location)
  ) {
    options.push({
      name: 'Location Action',
      max: 1,
      options: [location.details.name],
    })
  }
}

function _addQuorumActions(context, options) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const cardNames = game
    .getCardsKindByPlayer('quorum', player)
    .map(c => c.name)

  if (cardNames.length) {
    options.push({
      name: 'Quorum Card',
      max: 1,
      options: [...new Set(cardNames)].sort()
    })
  }
}

function _addOncePerGameActions(context, options) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  let name = ''

  if (player.oncePerGameUsed) {
    return
  }
  else if (character.name === 'Gaius Baltar') {
    name = 'Cylon Detector'
  }
  else if (character.name === 'Laura Roslin') {
    name = 'Skilled Politician'
  }
  else if (character.name === 'Lee "Apollo" Adama') {
    name = 'CAG'
  }
  else if (character.name === 'Saul Tigh') {
    name = 'Declare Martial Law'
  }
  else if (character.name === 'Tom Zarek') {
    name = 'Unconventional Tactics'
  }

  if (name) {
    options.push({
      name: 'Once Per Game Action',
      max: 1,
      options: [name],
    })
  }
}

function _addLoyaltyActions(context, options) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const cardTexts = game
    .getCardsKindByPlayer('loyalty', player)
    .filter(c => c.name === "You Are a Cylon")
    .map(c => c.text)

  const cardOptions = []

  for (const text of cardTexts) {
    if (text.includes('SICKBAY')) {
      cardOptions.push('send player to sickbay')
    }
    else if (text.includes('THE BRIG')) {
      cardOptions.push('send player to brig')
    }
    else if (text.includes('MORALE')) {
      cardOptions.push('reduce morale by 1')
    }
    else if (text.includes('DAMAGE')) {
      cardOptions.push('damage galactica')
    }
    else {
      throw new Error(`Unknown Cylon card: ${text}`)
    }
  }

  if (cardOptions.length > 0) {
    options.push({
      name: 'Reveal as Cylon',
      max: 1,
      options: cardOptions,
    })
  }
}
