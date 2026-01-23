Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Comb", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Metalworking'],
        green: ['Comb'],
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel', 'Sailing', 'Code of Laws', 'Agriculture'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Comb')
    request = t.choose(game, 'green')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Metalworking'],
        green: ['Comb'],
        hand: ['The Wheel', 'Sailing'],
      },
    })
  })

  test('dogam: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Measurement'],
        hand: ['Metalworking'],
        forecast: ['Comb'],
      },
      micah: {
        green: ['Navigation', 'Paper'],
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel', 'Sailing', 'Code of Laws', 'Agriculture'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Metalworking')
    request = t.choose(game, 'green')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Metalworking'],
        hand: ['The Wheel', 'Sailing'],
      },
    })

  })
})
