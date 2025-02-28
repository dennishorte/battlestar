Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Candles", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Candles'],
      },
      micah: {
        hand: ['Sailing', 'Masonry'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
        echo: {
          1: ['Noodles'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Candles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Candles'],
        hand: ['Machinery', 'Masonry'],
      },
      micah: {
        hand: ['Sailing', 'Noodles'],
        score: ['Software'],
      },
    })
  })

  test('dogma: nothing transferred', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Candles'],
      },
      micah: {
        hand: ['Sailing'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Candles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Candles'],
        hand: ['Machinery'],
      },
      micah: {
        hand: ['Sailing'],
        score: ['Software'],
      },
    })
  })
})
