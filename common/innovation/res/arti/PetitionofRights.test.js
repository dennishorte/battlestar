Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Petition of Rights", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Petition of Rights"],
      },
      micah: {
        purple: ['Philosophy'],
        red: ['Archery'],
        yellow: ['Fermenting'],
        score: ['Tools', 'Sailing', 'Calendar'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing'],
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
