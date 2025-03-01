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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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
