function characterSelection(context) {
  const game = context.state

  if (!context.data.initialized) {
    game.rk.sessionStart(session => {
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

function distributeTitleCards(context, state) {
  const playerCharacters = state.players.map(p => [p, state.playerCharacter(p)])
  playerCharacters.sort((l, r) => admiralSort(l, r))
  state.assignAdmiral(playerCharacters[0][0])

  playerCharacters.sort((l, r) => presidentSort(l, r))
  state.assignPresident(playerCharacters[0][0])

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

function each(func, paramName, paramPath) {
  return function(context, state) {
    const params = jsonpath.at(state, paramPath)
    context.data.paramIndex = 0

    if (context.data.paramIndex < params.length) {
      context.data[paramName] = params[context.data.paramIndex]
      context.data.paramIndex += 1
      func(context, state)
    }
    else {
      context.done()
    }
  }
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
      'receive-skills',
    ]
  },

  'character-selection': {
    func: characterSelection,
  },

  'character-selection-do': {
    func: characterSelectionDo,
  },

  'setup.distribute-title-cards': {
    func: () => {}
  },
  'setup.distribute-loyalty-cards': {
    func: () => {}
  },

  'setup.receive-skills': {
    func: () => {},
    actor: 'each',
    actorParams: '.players',
  },

  'main': {
    func: () => {},
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
