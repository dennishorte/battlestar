const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
  DuplicateResponseError,
} = require('./game.js')
const util = require('./util.js')


////////////////////////////////////////////////////////////////////////////////
// TestGame fixture

function TestGame(serialized_data) {
  Game.call(this, serialized_data)
}

util.inherit(Game, TestGame)

TestGame.prototype._mainProgram = function() {
  this.main()
}

TestGame.prototype._gameOver = function(e) {
  return 'Game Over'
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

  throw new GameOverEvent('game over')
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
// Tests

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
      key: result1.key
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
        key: result1.key
      })
      return [game, result2]
    }

    test('first response triggers another request with only the unresponded', () => {
      const [game, request] = multiFixture()
      const result = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
        key: request.key,
      })

      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.selectors.length).toBe(1)
      expect(result.selectors[0]).toEqual(expect.objectContaining({
        actor: 'micah',
        title: 'How Many',
        choices: [5,6,7],
      }))
    })

    test('same person sends multiple responses causes error', () => {
      const [game, request] = multiFixture()
      const result = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
        key: request.key,
      })
      const badRequest = () => {
        game.respondToInputRequest({
          actor: 'dennis',
          title: 'How Many',
          selection: [2],
          key: request.key,
        })
      }
      expect(badRequest).toThrow(DuplicateResponseError)
    })

    test('second response finalizes request and all responses are returned', () => {
      const [game, request] = multiFixture()
      const result1 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'How Many',
        selection: [3],
        key: request.key,
      })
      const result2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'How Many',
        selection: [5],
        key: result1.key,
      })

      expect(result2).not.toBeInstanceOf(InputRequestEvent)
      expect(game.state.testMulti).toEqual(expect.arrayContaining([
        expect.objectContaining({
          actor: 'dennis',
          title: 'How Many',
          selection: [3],
          key: request.key,
        }),
        expect.objectContaining({
          actor: 'micah',
          title: 'How Many',
          selection: [5],
          key: result1.key,
        }),
      ]))
    })
  })
})
