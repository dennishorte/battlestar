Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Communist Manifesto", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Communist Manifesto"],
      },
      decks: {
        base: {
          6: ['Classification', 'Metric System', 'Democracy'],
          7: ['Lighting', 'Railroad'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Railroad')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Railroad'],
        hand: ['Classification', 'Metric System', 'Democracy'],
      },
      micah: {
        purple: ['Lighting'],
      }
    })
  })
})
