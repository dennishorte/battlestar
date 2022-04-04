Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Principa", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Principa"],
        green: ['Sailing'],
        blue: ['Experimentation'],
        yellow: ['Canning', 'Agriculture'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Calendar', 'Experimentation'],
        purple: ['Lighting'],
        yellow: ['Agriculture'],
      }
    })
  })
})
