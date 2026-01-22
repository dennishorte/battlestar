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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Steamboat')
    request = t.choose(game, 'auto')

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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Steamboat')

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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Steamboat')

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
