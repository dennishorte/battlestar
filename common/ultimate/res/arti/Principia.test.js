Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Principia", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Principia"],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Calendar', 'Experimentation'],
        purple: ['Lighting'],
        yellow: ['Agriculture'],
        museum: ['Museum 1', 'Principia'],
      }
    })
  })
})
