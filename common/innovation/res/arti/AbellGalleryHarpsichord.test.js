Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Abell Gallery Harpsichord', () => {

  test('dogma: no effect all around', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Abell Gallery Harpsichord'],
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        green: ['Paper'],
        red: ['Engineering'],
        purple: ['Societies'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          2: ['Construction'],
          5: ['Astronomy'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        green: ['Paper'],
        red: ['Engineering'],
        purple: ['Societies'],
        score: ['Sailing', 'Construction', 'Astronomy'],
      },
    })
  })
})
