import {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
  SerializedGame,
} from './game.js'


////////////////////////////////////////////////////////////////////////////////
// TestGame fixture

class TestGame extends Game {
  constructor(serialized_data: SerializedGame) {
    super(serialized_data)
  }

  _mainProgram(): void {
    this.main()
  }

  main(): void {
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
}

function TestFactory(): TestGame {
  const data = GameFactory({
    name: 'test_game',
    players: [{ _id: 'dennis_id', name: 'dennis' }, { _id: 'micah_id', name: 'micah' }],
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
