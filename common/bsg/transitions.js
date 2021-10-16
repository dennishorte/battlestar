const bsgutil = require('./util.js')
const util = require('../lib/util.js')


function characterSelection(context) {
  const game = context.state

  if (!context.data.initialized) {
    game.rk.sessionStart(session => {
      session.addKey(context.data, 'initialized', true)
      session.addKey(context.data, 'playerIndex', 0)
    })

    const playerName = game.getPlayerByIndex(context.data.playerIndex).name
    return context.push('character-selection-do', { playerName })
  }

  else {
    game.rk.sessionStart(session => {
      session.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    })
    if (context.data.playerIndex < game.getPlayerAll().length) {
      const playerName = game.getPlayerByIndex(context.data.playerIndex).name
      return context.push('character-selection-do', { playerName })
    }
    else {
      return context.done()
    }
  }
}

function characterSelectionDo(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (context.response) {
    const characterName = context.response
    game.aSelectCharacter(player, characterName)

    // Apollo still needs to launch in a viper
    if (
      characterName === 'Lee "Apollo" Adama'
      && game.getCardsKindByPlayer('player-token', player).length > 0
    ) {
      return context.push('launch-self-in-viper', { playerName: player.name })
    }
    else {
      return context.done()
    }
  }

  else {
    const characterDeck = game.getZoneByName('decks.character')
    const availableCharacters = characterDeck.cards.map(c => c.name).sort()

    return context.wait({
      name: player.name,
      actions: [
        {
          name: 'Select Character',
          options: availableCharacters,
        },
      ]
    })
  }
}

function distributeLoyaltyCards(context) {
  const game = context.state
  const numPlayers = game.getPlayerAll().length
  const gaiusPlayer = game.getPlayerWithCard('Gaius Baltar')
  const sharonPlayer = game.getPlayerWithCard('Sharon "Boomer" Valeri')

  let humanCount
  let cylonCount
  let sympathizer = false

  if (numPlayers == 3) {
    humanCount = 5
    cylonCount = 1
  }
  else if (numPlayers == 4) {
    humanCount = 6
    cylonCount = 1
    sympathizer = true
  }
  else if (numPlayers == 5) {
    humanCount = 8
    cylonCount = 2
  }
  else if (numPlayers == 6) {
    humanCount = 9
    cylonCount = 2
    sympathizer = true
  }
  else {
    throw new Error(`Invalid number of players: ${numPlayers}`)
  }

  if (gaiusPlayer) {
    humanCount += 1
  }
  if (sharonPlayer) {
    humanCount += 1
  }

  game.rk.sessionStart(session => {
    for (let i = 0; i < humanCount; i++) {
      game.mMoveByIndices('decks.human', 0, 'decks.loyalty', 0)
    }
    for (let i = 0; i < cylonCount; i++) {
      game.mMoveByIndices('decks.cylon', 0, 'decks.loyalty', 0)
    }

    game.mLog({
      template: `Loyalty deck created with ${humanCount} humans and ${cylonCount} cylons`,
      actor: 'admin',
    })

    game.mLog({
      template: 'Each player receives one loyalty card',
      actor: 'admin',
    })

    for (const player of game.getPlayerAll()) {
      const playerZone = game.getZoneByPlayer(player)
      game.mMoveByIndices('decks.loyalty', 0, playerZone.name, playerZone.length)
    }

    if (gaiusPlayer) {
      const playerZone = game.getZoneByPlayer(gaiusPlayer)
      game.mMoveByIndices('decks.loyalty', 0, playerZone.name, playerZone.length)

      game.mLog({
        template: '{player} receives a second loyalty as Gaius Baltar',
        actor: 'admin',
        args: {
          player: gaiusPlayer.name,
        }
      })
    }

    if (sympathizer) {
      game.mMoveByIndices('decks.sympathizer', 0, 'decks.loyalty', 0)
      game.mLog({
        template: 'Sympathizer card added to the loyalty deck',
        actor: 'admin',
      })
    }
  })

  context.done()
}

function _admiralSort(l, r) {
  return l[1]['admiral line of succession order'] - r[1]['admiral line of succession order']
}

function _presidentSort(l, r) {
  return l[1]['president line of succession order'] - r[1]['president line of succession order']
}

function distributeTitleCards(context) {
  const game = context.state
  const playerCharacters = game.getPlayerAll().map(p => [p, game.getCardCharacterByPlayer(p)])

  playerCharacters.sort(_admiralSort)
  const admiral = playerCharacters[0][0]
  game.aAssignAdmiral(admiral)

  playerCharacters.sort(_presidentSort)
  const president = playerCharacters[0][0]
  game.aAssignPresident(president)

  context.done()
}

function initialize(context) {
  const game = context.state
  game.rk.sessionStart(session => {
    game.mLog({
      template: "Placing initial ships",
      actor: 'admin',
    })

    for (let i = 0; i < 3; i++) {
      game.mMoveByIndices('ships.raiders', 0, 'space.space0', 0)
    }
    for (let i = 0; i < 2; i++) {
      game.mMoveByIndices('decks.civilian', 0, 'space.space3', 0)
    }
    game.mMoveByIndices('ships.basestarA', 0, 'space.space0', 0)
    game.mMoveByIndices('ships.vipers', 0, 'space.space4', 0)
    game.mMoveByIndices('ships.vipers', 0, 'space.space5', 0)
  })

  context.done()
}

function launchSelfInViper(context) {
  const game = context.state

  // If character is already in space, they've done this action
  if (game.checkPlayerIsInSpace(context.data.playerName)) {
    context.done()
  }


  // If all the vipers are launched, the player can choose an existing viper to "relaunch"
  else if (game.getZoneByName('ships.vipers').cards.length === 0) {
    // Get the locations of all launched vipers.
    const launched = []

    // If all of the vipers are damaged or destroyed, this should not have been allowed.
    if (launched.length === 0) {
      throw new Error("All vipers are damaged or destroyed. Can't launch")
    }

    context.wait({
      name: context.data.playerName,
      actions: [
        {
          name: 'Relaunch Viper',
          count: 2,
          options: [
            launched,
            ['Lower Left', 'Lower Right'],
          ]
        }
      ]
    })
  }

  // Wait for the player to choose
  else {
    context.wait({
      name: context.data.playerName,
      actions: [
        {
          name: 'Launch Self in Viper',
          options: [
            'Lower Left',
            'Lower Right',
          ],
        },
      ]
    })
  }
}

function mainPlayerLoop(context) {
  const game = context.state

  game.rk.sessionStart(() => {
    game.mStartNextTurn()
  })

  context.push('player-turn', { playerName: game.getPlayerCurrentTurn().name })
}

function playerTurnAction(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()

  context.wait({
    name: player.name,
    actions: [
      {
        name: 'Action',
        options: [],
      },
    ]
  })
}

function playerTurnMovement(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()

  // If the player is in the brig, they don't get to move
  if (game.checkPlayerIsAtLocation(player, 'Brig')) {
    game.rk.sessionStart(() => {
      game.mLog({
        template: "{player} can't move because they are in the brig",
        actor: 'admin',
        args: {
          player: player.name
        }
      })
    })
    return context.done()
  }

  // If the player is in a Viper, they can move one step in space or land on a ship for one card
  if (game.checkPlayerIsInSpace(player)) {
    return context.wait({
      name: player.name,
      actions: [{
        name: 'Movement',
        options: [
          {
            name: 'Move Viper',
            options: [],
          },
          {
            name: 'Land Viper',
            options: [],
          }
        ]
      }]
    })
  }

  const options = []
  const playerZone = game.getZoneByPlayerLocation(player)

  // Locations for Revealed Cylons
  if (game.checkPlayerIsRevealedCylon(player)) {
    options.push({
      name: 'Cylon Locations',
      options: game.getLocationsByArea('Cylon Locations')
                   .filter(l => l.name !== playerZone.name)
                   .map(l => l.details.name)
    })
  }

  // Locations for Humans
  else {
    // Galactica Locations
    options.push({
      name: 'Galactica',
      options: game.getLocationsByArea('Galactica')
                   .filter(l => !l.details.hazardous)
                   .filter(l => l.name !== playerZone.name)
                   .filter(l => !game.checkLocationIsDamaged(l))
                   .map(l => l.details.name)
    })

    // Colonial One locations
    if (!game.checkColonialOneIsDestroyed()) {
      options.push({
        name: 'Colonial One',
        options: game.getLocationsByArea('Colonial One')
                     .filter(l => l.name !== playerZone.name)
                     .map(l => l.details.name)
      })
    }
  }

  context.wait({
    name: player.name,
    actions: [
      {
        name: 'Movement',
        options,
      },
    ]
  })
}

function playerTurnReceiveSkills(context) {
  const game = context.state
  const player = game.getPlayerCurrentTurn()

  const playerInSickbay = game.checkPlayerIsAtLocation(player, 'Sickbay')
  const playerIsRevealedCylon = game.checkPlayerIsRevealedCylon(player)
  const character = game.getCardCharacterByPlayer(player)
  const skills = _characterSkills(character)
  const optionalSkills = skills.filter(s => s.optional)
  const requiredSkills = skills.filter(s => !s.optional)
  const requiredSkillNames = []

  // Cylons don't have required skills
  // Players in sickbay only get a single skill card
  if (!playerIsRevealedCylon && !playerInSickbay) {
    for (const { name, value } of requiredSkills) {
      for (let i = 0; i < value; i++) {
        requiredSkillNames.push(name)
      }
    }
  }

  // Player has chosen their optional skills. Draw all skill cards
  if (context.response) {
    // Sometimes, the player is only making a single choice and returns a string.
    // Other times, they are making multiple choices, and return an array.
    let chosen = context.response
    if (typeof context.response === 'string') {
      chosen = [chosen]
    }
    const toDraw = requiredSkillNames.concat(chosen)
    game.aDrawSkillCards(player, toDraw)
    return context.done()
  }

  if (playerIsRevealedCylon) {
    return context.wait({
      name: player.name,
      actions: [{
        name: 'Select Skills',
        count: 2,
        options: [...bsgutil.skillList, ...bsgutil.skillList].sort(),
      }]
    })
  }

  // Characters in sickbay can only draw one card.
  // Give them a list of options
  if (playerInSickbay) {
    game.rk.sessionStart(() => {
      game.mLog({
        template: '{player} is in sickbay and will only draw one card',
        args: {
          player: player.name,
        }
      })
    })

    const options = skills.map(c => c.name)
    return context.wait({
      name: player.name,
      actions: [
        {
          name: 'Select Skills',
          count: 1,
          options,
        },
      ]
    })
  }

  // Automatically draw skill cards if possible.
  if (optionalSkills.length === 0) {
    game.aDrawSkillCards(player, requiredSkillNames)
    return context.done()
  }

  // Let the player choose which optional cards to draw.
  // Don't draw any cards until they have made their decision.
  return context.wait({
    name: player.name,
    actions: [
      {
        name: 'Select Skills',
        operator: 'and',
        options: _optionalSkillOptions(optionalSkills),
      },
    ]
  })
}

function receiveInitialSkills(context) {
  const game = context.state

  // initialize
  if (!context.data.initialized) {
    game.rk.sessionStart(session => {
      session.addKey(context.data, 'initialized', true)
      session.addKey(context.data, 'playerIndex', 1)
    })
    const playerName = game.getPlayerByIndex(context.data.playerIndex).name
    context.push('receive-initial-skills-do', { playerName })
  }

  else {
    game.rk.sessionStart(session => {
      session.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    })
    if (context.data.playerIndex < game.getPlayerAll().length) {
      const playerName = game.getPlayerByIndex(context.data.playerIndex).name
      context.push('receive-initial-skills-do', { playerName })
    }
    else {
      context.done()
    }
  }
}

function _characterSkills(character) {
  const output = []
  for (let skill of bsgutil.skillList) {
    skill = skill.toLowerCase()
    const charSkill = character[skill]
    if (charSkill) {
      const optional = charSkill.slice(-1) === '*'
      const value = parseInt(charSkill)

      output.push({
        name: skill,
        value,
        optional,
      })
    }
  }

  return output
}

function _optionalSkillOptions(optionalSkills) {
  if (optionalSkills.length === 0) {
    return []
  }

  const options = []
  const optionalPairs = [optionalSkills[0].name, optionalSkills[1].name]
  for (let i = 0; i < optionalSkills[0].value; i++) {
    options.push({
      options: optionalPairs
    })
  }
  return options
}

function receiveInitialSkillsDo(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (context.response) {
    game.aDrawSkillCards(player, context.response)
    return context.done()
  }

  else {
    const character = game.getCardCharacterByPlayer(player)
    const skills = _characterSkills(character)
    const optionalSkills = skills.filter(s => s.optional)
    const requiredSkills = skills.filter(s => !s.optional)

    util.assert(
      optionalSkills.length === 0 || optionalSkills.length === 2,
      `Unexpect number of optional skills: ${optionalSkills.length}`
    )

    const skillChoices = []
    for (const skill of requiredSkills) {
      for (let i = 0; i < skill.value; i++) {
        skillChoices.push(skill.name)
      }
    }
    for (const choice of _optionalSkillOptions(optionalSkills)) {
      skillChoices.push(choice)
    }

    context.wait({
      name: player.name,
      actions: [
        {
          name: 'Select Starting Skills',
          count: 3,
          options: skillChoices,
        },
      ]
    })
  }
}

// Temporary function to pause execution while evaluating each step
function waitFunc(context) {
  context.wait({ name: 'dennis', actions: [{ name: 'test' }] })
}


const transitions = {
  root: {
    steps: [
      'initialize',
      'setup',
      'main',
      'END'
    ],
  },

  'initialize': {
    func: initialize,
  },

  'setup': {
    steps: [
      'character-selection',
      'distribute-title-cards',
      'distribute-loyalty-cards',
      'receive-initial-skills',
    ]
  },

  'character-selection': {
    func: characterSelection,
  },

  'character-selection-do': {
    func: characterSelectionDo,
  },

  'distribute-title-cards': {
    func: distributeTitleCards,
  },

  'distribute-loyalty-cards': {
    func: distributeLoyaltyCards,
  },

  'receive-initial-skills': {
    func: receiveInitialSkills,
  },

  'receive-initial-skills-do': {
    func: receiveInitialSkillsDo,
  },

  'main': {
    func: mainPlayerLoop,
  },

  'player-turn': {
    steps: [
      'player-turn-receive-skills',
      'player-turn-movement',
      'player-turn-action',
      'player-turn-crisis',
      'player-turn-cylon-activation',
      'player-turn-prepare-for-jump',
      'player-turn-cleanup',
    ],
  },

  'player-turn-receive-skills': {
    func: playerTurnReceiveSkills,
  },
  'player-turn-movement': {
    func: playerTurnMovement,
  },
  'player-turn-action': {
    func: playerTurnAction,
  },
  'player-turn-crisis': {
    func: waitFunc,
  },
  'player-turn-cylon-activation': {
    func: () => {}
  },
  'player-turn-prepare-for-jump': {
    func: () => {}
  },
  'player-turn-cleanup': {
    func: () => {}
  },

  'launch-self-in-viper': {
    func: launchSelfInViper,
  },
}

module.exports = transitions
