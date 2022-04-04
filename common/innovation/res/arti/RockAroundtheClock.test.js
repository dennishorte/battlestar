Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rock Around the Clock", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Rock Around the Clock"],
        blue: ['Computers'],
        red: ['Industrialization'],
        green: ['Databases'],
      },
      decks: {
        base: {
          9: ['Fission', 'Services'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Computers'],
        red: ['Industrialization'],
        green: ['Databases'],
        score: ['Fission', 'Services'],
      }
    })
  })
})
