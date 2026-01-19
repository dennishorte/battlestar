Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Petition of Right", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Petition of Right"],
      },
      micah: {
        purple: ['Philosophy'],
        red: ['Archery'],
        yellow: ['Fermenting'],
        score: ['Tools', 'Sailing', 'Calendar'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing'],
        hand: ['Metalworking'],
        museum: ['Museum 1', 'Petition of Right'],
      },
      micah: {
        purple: ['Philosophy'],
        red: ['Archery'],
        yellow: ['Fermenting'],
        score: ['Calendar'],
      },
    })
  })
})
