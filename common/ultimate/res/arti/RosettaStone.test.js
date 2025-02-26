Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rosetta Stone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Rosetta Stone"],
      },
      decks: {
        arti: {
          2: ['Holy Lance', 'Baghdad Battery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'arti')
    const request4 = t.choose(game, request3, 'Baghdad Battery')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        green: ['Baghdad Battery'],
      },
      micah: {
        green: ['Holy Lance'],
      },
    })
  })
})
