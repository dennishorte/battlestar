const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./game.js')
const util = require('../lib/util.js')


////////////////////////////////////////////////////////////////////////////////
// InputRequestEvent tests

describe('InputRequestEvent', () => {
  test('defaults concurrent to false', () => {
    const event = new InputRequestEvent([{ actor: 'player1', title: 'Test' }])
    expect(event.concurrent).toBe(false)
  })

  test('accepts concurrent option', () => {
    const event = new InputRequestEvent([{ actor: 'player1', title: 'Test' }], { concurrent: true })
    expect(event.concurrent).toBe(true)
  })

  test('normalizes single selector to array', () => {
    const event = new InputRequestEvent({ actor: 'player1', title: 'Test' })
    expect(Array.isArray(event.selectors)).toBe(true)
    expect(event.selectors.length).toBe(1)
  })
})


////////////////////////////////////////////////////////////////////////////////
// TestGame fixture

function TestGame(serialized_data) {
  Game.call(this, serialized_data)
}

util.inherit(Game, TestGame)

TestGame.prototype._mainProgram = function() {
  this.main()
}

TestGame.prototype.main = function() {
  this.state.testColor = this.requestInputSingle({
    actor: 'dennis',
    title: "Choose a Color",
    choices: ['red', 'blue'],
  })[0]

  this.state.testMulti = this.requestInputMany([
    {
      actor: 'dennis',
      title: 'How Many',
      choices: [1,2,3,4]
    },
    {
      actor: 'micah',
      title: 'How Many',
      choices: [5,6,7]
    }
  ])

  throw new GameOverEvent({
    player: 'everyone',
    reason: 'game over',
  })
}

function TestFactory() {
  const data = GameFactory({
    name: 'test_game',
    players: ['dennis', 'micah'],
    seed: 'test_seed'
  }).serialize()
  return new TestGame(data)
}


////////////////////////////////////////////////////////////////////////////////
// TestGame for requestInputAny (concurrent mode)

function TestGameAny(serialized_data) {
  Game.call(this, serialized_data)
}

util.inherit(Game, TestGameAny)

TestGameAny.prototype._mainProgram = function() {
  // Simulate a draft-like scenario where any player can respond
  const response = this.requestInputAny([
    { actor: 'dennis', title: 'Draft Card', choices: ['cardA', 'cardB'] },
    { actor: 'micah', title: 'Draft Card', choices: ['cardC', 'cardD'] },
  ])
  this.state.drafted = response.selection[0]

  throw new GameOverEvent({ player: 'everyone', reason: 'draft complete' })
}

function TestFactoryAny() {
  const data = GameFactory({
    name: 'test_game_any',
    players: ['dennis', 'micah'],
    seed: 'test_seed'
  }).serialize()
  return new TestGameAny(data)
}


////////////////////////////////////////////////////////////////////////////////
// Tests

describe('concurrent response mode', () => {
  describe('requestInputSingle', () => {
    test('sets concurrent to false', () => {
      const game = TestFactory()
      const result = game.run()
      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.concurrent).toBe(false)
    })
  })

  describe('requestInputMany', () => {
    test('sets concurrent to false', () => {
      const game = TestFactory()
      game.run()
      // Respond to first request to get to requestInputMany
      const result = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose a Color',
        selection: ['red'],
      })
      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.concurrent).toBe(false)
    })

    test('keeps concurrent false as responses are collected', () => {
      const game = TestFactory()
      game.run()
      game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose a Color',
        selection: ['red'],
      })
      // First response to requestInputMany
      const result = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
      })
      // Still waiting for micah - should still be concurrent: false
      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.concurrent).toBe(false)
      expect(result.selectors.length).toBe(1)
      expect(result.selectors[0].actor).toBe('micah')
    })
  })

  describe('requestInputAny', () => {
    test('sets concurrent to true', () => {
      const game = TestFactoryAny()
      const result = game.run()
      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.concurrent).toBe(true)
    })

    test('allows any player to respond', () => {
      const game = TestFactoryAny()
      game.run()
      // micah responds (not dennis who is first in the list)
      const result = game.respondToInputRequest({
        actor: 'micah',
        title: 'Draft Card',
        selection: ['cardC'],
      })
      // Game should complete (GameOverEvent caught)
      expect(result).toBeInstanceOf(GameOverEvent)
      expect(game.state.drafted).toBe('cardC')
    })
  })
})

describe('getWaitingState', () => {
  test('returns null when not waiting', () => {
    const game = TestFactory()
    // Before running, game is not waiting
    expect(game.getWaitingState()).toBeNull()
  })

  test('returns players and concurrent for requestInputSingle', () => {
    const game = TestFactory()
    game.run()
    const waitingState = game.getWaitingState()
    expect(waitingState).toEqual({
      players: ['dennis'],
      concurrent: false,
    })
  })

  test('returns players and concurrent for requestInputMany', () => {
    const game = TestFactory()
    game.run()
    game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose a Color',
      selection: ['red'],
    })
    const waitingState = game.getWaitingState()
    expect(waitingState).toEqual({
      players: ['dennis', 'micah'],
      concurrent: false,
    })
  })

  test('returns players and concurrent for requestInputAny', () => {
    const game = TestFactoryAny()
    game.run()
    const waitingState = game.getWaitingState()
    expect(waitingState).toEqual({
      players: ['dennis', 'micah'],
      concurrent: true,
    })
  })

  test('updates as players respond to requestInputMany', () => {
    const game = TestFactory()
    game.run()
    game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose a Color',
      selection: ['red'],
    })
    // Both players waiting
    expect(game.getWaitingState().players).toEqual(['dennis', 'micah'])

    game.respondToInputRequest({
      actor: 'dennis',
      title: 'How Many',
      selection: [3],
    })
    // Now only micah waiting
    expect(game.getWaitingState().players).toEqual(['micah'])
  })
})

describe('user input', () => {
  test('game returns user input request', () => {
    const game = TestFactory()
    const result = game.run()
    expect(result).toBeInstanceOf(InputRequestEvent)
    expect(result.selectors[0].title).toBe('Choose a Color')
  })

  test('game proceeds after receiving input', () => {
    const game = TestFactory()
    const result1 = game.run()
    const result2 = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose a Color',
      selection: ['red'],
    })

    expect(result2).toBeInstanceOf(InputRequestEvent)
    expect(result2.selectors[0].title).toBe('How Many')
    expect(game.state.testColor).toBe('red')
  })

  describe('request multiple inputs', () => {
    function multiFixture() {
      const game = TestFactory()
      const result1 = game.run()
      const result2 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose a Color',
        selection: ['red'],
      })
      return [game, result2]
    }

    test('first response triggers another request with only the unresponded', () => {
      const [game, request] = multiFixture()
      const result = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
      })

      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.selectors.length).toBe(1)
      expect(result.selectors[0]).toEqual(expect.objectContaining({
        actor: 'micah',
        title: 'How Many',
        choices: [5,6,7],
      }))
    })

    test('second response finalizes request and all responses are returned', () => {
      const [game, request] = multiFixture()
      const result1 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
      })
      const result2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'How Many',
        selection: [5],
      })

      expect(result2).not.toBeInstanceOf(InputRequestEvent)
      expect(game.state.testMulti).toEqual(expect.arrayContaining([
        expect.objectContaining({
          actor: 'dennis',
          title: 'How Many',
          selection: [3],
        }),
        expect.objectContaining({
          actor: 'micah',
          title: 'How Many',
          selection: [5],
        }),
      ]))
    })
  })
})
