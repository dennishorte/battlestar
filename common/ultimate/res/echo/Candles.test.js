Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Candles", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
        red: ['Candles'],
      },
      micah: {
        hand: ['Sailing', 'Masonry'],
        score: ['Software'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
          3: ['Machinery'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Candles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        red: ['Candles'],
        hand: ['Machinery', 'Masonry'],
      },
      micah: {
        hand: ['Sailing', 'Metalworking'],
        score: ['Software'],
      },
    })
  })

  test('dogma: nothing transferred', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
        red: ['Candles'],
      },
      micah: {
        hand: ['Sailing'],
        score: ['Bangle'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Candles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        red: ['Candles'],
        hand: ['Machinery'],
      },
      micah: {
        hand: ['Sailing'],
        score: ['Bangle'],
      },
    })
  })
})
