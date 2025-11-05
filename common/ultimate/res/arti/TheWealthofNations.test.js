Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Wealth of Nations", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Wealth of Nations"],
        score: ['Canning', 'Software'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Sailing', 'Gunpowder', 'Canning', 'Software'],
        museum: ['Museum 1', 'The Wealth of Nations'],
      },
    })
    t.testDeckIsJunked(game, 4)
  })
})
