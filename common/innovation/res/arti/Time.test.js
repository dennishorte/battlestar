Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Time", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Time"],
      },
      micah: {
        green: ['Databases', 'Self Service'],
        purple: ['Lighting'],

      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Databases')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Databases'],
        purple: ['Lighting'],
      },
      micah: {
        green: ['Self Service'],
      },
    })
  })
})
