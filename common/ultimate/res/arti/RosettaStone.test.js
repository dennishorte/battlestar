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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'arti')
    request = t.choose(game, request, 'Baghdad Battery')

    t.testIsFirstAction(request)
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
