Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Steamboat", () => {

  test('dogma: blue or yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Steamboat'],
      },
      micah: {
        hand: ['Candles'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          6: ['Atomic Theory']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Steamboat')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Steamboat'],
        hand: ['Candles', 'Atomic Theory'],
      },
      micah: {
        score: ['Sailing'],
      },
    })
  })

  test('dogma: red or green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Steamboat'],
      },
      micah: {
        hand: ['Candles'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          6: ['Classification']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Steamboat')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Steamboat'],
        score: ['Sailing'],
      },
      micah: {
        hand: ['Candles', 'Classification'],
      },
    })
  })

  test('dogma: purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Steamboat'],
      },
      micah: {
        hand: ['Candles'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          6: ['Democracy']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Steamboat')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Steamboat'],
      },
      micah: {
        hand: ['Candles', 'Democracy'],
        score: ['Sailing'],
      },
    })
  })
})
