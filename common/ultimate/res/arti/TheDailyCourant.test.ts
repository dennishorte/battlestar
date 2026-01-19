Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("The Daily Courant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Daily Courant"],
        red: ['Construction'],
        blue: ['Mathematics'],
      },
      decks: {
        base: {
          1: ['Archery'],
          2: ['Monotheism'],
          6: ['Encyclopedia'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction', 'Archery'],
        blue: ['Mathematics'],
        purple: ['Monotheism'],
        museum: ['Museum 1', 'The Daily Courant'],
      },
    })
  })

  test('dogma: no top card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Daily Courant"],
        red: ['Construction'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Archery'],
          6: ['Encyclopedia'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Construction'],
        green: ['Sailing'],
        museum: ['Museum 1', 'The Daily Courant'],
      },
    })
  })
})
