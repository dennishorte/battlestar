Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Comb')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'auto')

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
    request = t.choose(game, request, 'Meld.Metalworking')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Metalworking'],
        hand: ['The Wheel', 'Sailing'],
      },
    })

  })
})
