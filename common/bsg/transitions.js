const util = require('../lib/util.js')


function characterSelection(context) {
  const game = context.state

  if (!context.data.initialized) {
    game.rk.sessionStart(session => {
      game.mLog({
        template: 'Character Selection',
        classes: ['phase', 'setup-phase'],
      })
      session.put(context.data, 'initialized', true)
      session.put(context.data, 'playerIndex', 0)
    })
    context.push('character-selection-do', { playerIndex: context.data.playerIndex })
  }

  else {
    game.rk.sessionStart(session => {
      session.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    })
    if (context.data.playerIndex < game.getPlayerAll().length) {
      context.push('character-selection-do', { playerIndex: context.data.playerIndex })
    }
    else {
      context.done()
    }
  }
}

function characterSelectionDo(context) {
  const game = context.state
  const player = game.getPlayerByIndex(context.data.playerIndex)

  if (game.checkPlayerHasCharacter(player)) {
    context.done()
  }
  else {
    const characterDeck = game.getZoneByName('decks.character')
    const availableCharacters = characterDeck.cards.map(c => c.name).sort()

    context.wait({
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
      template: 'Each player receives one loyalty card.',
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
        template: '{player} receives a second loyalty card due to {card}',
        actor: 'admin',
        args: {
          player: gaiusPlayer.name,
          card: game.getCardByName('Gaius Baltar'),
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

  game.rk.sessionStart(() => {
    playerCharacters.sort(_admiralSort)
    const admiral = playerCharacters[0][0]
    game.mAssignAdmiral(admiral)

    playerCharacters.sort(_presidentSort)
    const president = playerCharacters[0][0]
    game.mAssignPresident(president)
  })

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

function playerMovement(context) {
  const actor = context.data.actor

  if (context.data.destination) {
    state.movePlayer(actor, context.data.destination)
    context.done()
  }
  else {
    const moveOptions = ['Command', "President's Office"]

    context.wait({
      name: actor,
      actions: [
        {
          name: 'Move to',
          options: moveOptions,
        },
        {
          name: "Don't move"
        },
      ],
    })
  }
}

function playerAction(context, state) {
  const actor = context.data.actor
  const action = context.data.actin

  if (action) {
    if (action.source === 'skill card') {
      // Grab the card
      // Show the card to everyone
      // Execute the action on the card
    }
    else if (action.source === 'quorum card') {
      // Grab the card
      // Show the card to everyone
      // Execute the action on the card
    }
    else if (action.source === 'location') {
      //
    }
    else if (action.source === 'character') {
      //
    }
    else {
      console.log('Unknown action source: ', action)
      throw `Unknown action source: ${action.source}`
    }
  }
  else {
    context.wait({
      name: actor,
      actions: [
        {
          name: 'skip action',
        },
      ]
    })
  }
}

function receiveInitialSkills(context) {
  const game = context.state

  if (!context.data.initialized) {
    game.rk.sessionStart(session => {
      game.mLog({
        template: 'Receive Initial Skill Cards',
        classes: ['phase', 'setup-phase'],
      })
      session.put(context.data, 'initialized', true)
      session.put(context.data, 'playerIndex', 1)
    })
    context.push('receive-initial-skills-do', { playerIndex: context.data.playerIndex })
  }

  else {
    game.rk.sessionStart(session => {
      session.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    })
    if (context.data.playerIndex < game.getPlayerAll().length) {
      context.push('receive-initial-skills-do', { playerIndex: context.data.playerIndex })
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

function receiveInitialSkillsDo(context) {
  const game = context.state
  const player = game.getPlayerByIndex(context.data.playerIndex)

  if (game.getCardsKindByPlayer('skill', player).length >= 3) {
    context.done()
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
    if (optionalSkills.length) {
      const optionalPairs = [optionalSkills[0].name, optionalSkills[1].name]
      for (let i = 0; i < optionalSkills[0].value; i++) {
        skillChoices.push({
          operator: 'or',
          values: optionalPairs
        })
      }
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
    func: waitFunc,
    // func: receiveInitialSkills,
  },

  'receive-initial-skills-do': {
    func: receiveInitialSkillsDo,
  },

  'main': {
    func: waitFunc,
  },

  'main.player-turn': {
    steps: [
      'receive-skills',
      'movement',
      'action',
      'crisis',
      'cylon-activation',
      'prepare-for-jump',
      'cleanup',
    ],
  },

  'main.player-turn.receive-skills': {
    func: () => {}
  },
  'main.player-turn.movement': {
    func: () => {}
  },
  'main.player-turn.action': {
    func: () => {}
  },
  'main.player-turn.crisis': {
    func: () => {}
  },
  'main.player-turn.cylon-activation': {
    func: () => {}
  },
  'main.player-turn.prepare-for-jump': {
    func: () => {}
  },
  'main.player-turn.cleanup': {
    func: () => {}
  },
}

module.exports = transitions
