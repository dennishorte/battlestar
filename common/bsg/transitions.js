const bsgutil = require('./util.js')
const util = require('../lib/util.js')

const { stepFactory } = require('./transitions/factory.js')


function characterSelection(context) {
  const game = context.state

  if (!context.data.initialized) {
    game.rk.addKey(context.data, 'initialized', true)
    game.rk.addKey(context.data, 'playerIndex', 0)

    const playerName = game.getPlayerByIndex(context.data.playerIndex).name
    return context.push('character-selection-do', { playerName })
  }

  else {
    game.rk.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    if (context.data.playerIndex < game.getPlayerAll().length) {
      const playerName = game.getPlayerByIndex(context.data.playerIndex).name
      return context.push('character-selection-do', { playerName })
    }
    else {
      return context.done()
    }
  }
}

function distributeLoyaltyCards(context) {
  const game = context.state
  const numPlayers = game.getPlayerAll().length
  const gaiusPlayer = game.getPlayerWithCard('Gaius Baltar')
  const sharonPlayer = game.getPlayerWithCard('Sharon "Boomer" Valerii')

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

  for (let i = 0; i < humanCount; i++) {
    game.mMoveCard('decks.human', 'decks.loyalty')
  }
  for (let i = 0; i < cylonCount; i++) {
    game.mMoveCard('decks.cylon', 'decks.loyalty')
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
    game.mMoveCard('decks.loyalty', playerZone)
  }

  if (gaiusPlayer) {
    const playerZone = game.getZoneByPlayer(gaiusPlayer)
    game.mMoveCard('decks.loyalty', playerZone.name)

    game.mLog({
      template: '{player} receives a second loyalty as Gaius Baltar',
      actor: 'admin',
      args: {
        player: gaiusPlayer.name,
      }
    })
  }

  if (sympathizer) {
    game.mMoveCard('decks.sympathizer', 'decks.loyalty')
    game.mLog({
      template: 'Sympathizer card added to the loyalty deck',
      actor: 'admin',
    })
  }

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
  game.aDrawQuorumCard()

  context.done()
}

function initialize(context) {
  const game = context.state
  game.mLog({
    template: "Placing initial ships",
    actor: 'admin',
  })

  for (let i = 0; i < 3; i++) {
    game.mMoveCard('ships.raiders', 'space.space0')
  }
  for (let i = 0; i < 2; i++) {
    game.mMoveCard('decks.civilian', 'space.space3')
  }
  game.mMoveCard('ships.basestarA', 'space.space0')
  game.mMoveCard('ships.vipers', 'space.space4')
  game.mMoveCard('ships.vipers', 'space.space5')

  context.done()
}

function mainPlayerLoop(context) {
  const game = context.state

  game.mStartNextTurn()

  context.push('player-turn', { playerName: game.getPlayerCurrentTurn().name })
}

function receiveInitialSkills(context) {
  const game = context.state

  // initialize
  if (!context.data.initialized) {
    game.rk.addKey(context.data, 'initialized', true)
    game.rk.addKey(context.data, 'playerIndex', 1)
    const playerName = game.getPlayerByIndex(context.data.playerIndex).name
    return context.push('receive-initial-skills-do', { playerName })
  }

  else {
    game.rk.put(context.data, 'playerIndex', context.data.playerIndex + 1)
    if (context.data.playerIndex < game.getPlayerAll().length) {
      const playerName = game.getPlayerByIndex(context.data.playerIndex).name
      return context.push('receive-initial-skills-do', { playerName })
    }
    else {
      return context.done()
    }
  }
}

function receiveInitialSkillsDo(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (context.response) {
    const skillNames = bsgutil.flattenSkillSelection(context.response)
    game.aDrawSkillCards(player, skillNames)
    return context.done()
  }

  else {
    const character = game.getCardCharacterByPlayer(player)
    const skills = bsgutil.characterSkills(character)
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
    for (const choice of bsgutil.optionalSkillOptions(optionalSkills)) {
      skillChoices.push(choice)
    }

    context.wait({
      actor: player.name,
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
  context.wait({ actor: 'dennis', actions: [{ name: 'test' }] })
}


const transitions = {
  root: {
    func: stepFactory([
      'initialize',
      'setup',
      'main',
      'END'
    ]),
  },

  'initialize': {
    func: initialize,
  },

  'setup': {
    func: stepFactory([
      'character-selection',
      'distribute-title-cards',
      'distribute-loyalty-cards',
      'receive-initial-skills',
    ]),
  },

  'character-selection': {
    func: characterSelection,
  },

  'character-selection-do': {
    func: require('./transitions/characterSelectionDo.js'),
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
    func: stepFactory(
      [
        'player-turn-receive-skills',
        'player-turn-movement',
        'player-turn-action',
        'player-turn-crisis',
        'player-turn-cleanup',
      ],
      {
        childData: (context) => ({ playerName: context.state.getPlayerCurrentTurn().name }),
      }
    ),
  },

  'player-turn-receive-skills': {
    func: require('./transitions/playerTurnReceiveSkills.js'),
  },
  'player-turn-movement': {
    func: require('./transitions/playerTurnMovement.js'),
  },
  'player-turn-action': {
    func: require('./transitions/playerTurnAction.js'),
  },
  'player-turn-crisis': {
    func: require('./transitions/playerTurnCrisis.js'),
  },
  'player-turn-crisis-laura-roslin': {
    func: require('./transitions/playerTurnCrisisLauraRoslin.js'),
  },
  'player-turn-cleanup': {
    func: require('./transitions/playerTurnCleanup.js'),
  },

  'activate-admirals-quarters': {
    func: require('./transitions/activateAdmiralsQuarters.js'),
  },
  'activate-administration': {
    func: require('./transitions/activateAdministration.js'),
  },
  'activate-command': {
    func: require('./transitions/activateCommand.js'),
  },
  'activate-communications': {
    func: require('./transitions/activateCommunications.js'),
  },
  'activate-hangar-deck': {
    func: require('./transitions/activateHangarDeck.js'),
  },
  'activate-weapons-control': {
    func: require('./transitions/activateWeaponsControl.js'),
  },
  'activate-presidents-office': {
    func: require('./transitions/activatePresidentsOffice.js'),
  },

  'skill-card-executive-order': {
    func: require('./transitions/skillCardExecutiveOrder.js'),
  },
  'skill-card-maximum-firepower': {
    func: require('./transitions/skillCardMaximumFirepower.js'),
  },
  'skill-card-launch-scout': {
    func: require('./transitions/skillCardLaunchScout.js'),
  },

  'choose-player-to-send-to-brig': {
    func: require('./transitions/choosePlayerToSendToBrig.js'),
  },
  'discard-skill-cards': {
    func: require('./transitions/discardSkillCards.js'),
  },
  'draw-skill-cards': {
    func: require('./transitions/drawSkillCards.js'),
  },
  'evaluate-effects': {
    func: require('./transitions/evaluateEffects.js'),
  },
  'launch-self-in-viper': {
    func: require('./transitions/launchSelfInViper.js'),
  },

  'make-choice': {
    func: require('./transitions/makeChoice.js'),
  },

  'skill-check': {
    func: require('./transitions/skillCheck.js'),
  },

  'skill-check-discuss': {
    func: require('./transitions/skillCheckDiscuss.js')
  },

  'skill-check-add-cards': {
    func: require('./transitions/skillCheckAddCards.js')
  },

  'skill-check-post-reveal': {
    func: require('./transitions/skillCheckPostReveal.js')
  },

  'skill-check-declare-emergency': {
    func: require('./transitions/skillCheckDeclareEmergency.js')
  },

  'skill-check-resolve': {
    func: require('./transitions/skillCheckResolve.js')
  },

  'skill-check-cleanup': {
    func: require('./transitions/skillCheckCleanup.js')
  },

  'skill-check-command-authority': {
    func: require('./transitions/skillCheckCommandAuthority.js')
  },

  'jump-the-fleet': {
    func: require('./transitions/jumpTheFleet.js')
  },

  'jump-choose-destination': {
    func: require('./transitions/jumpChooseDestination.js')
  },
}

module.exports = transitions
