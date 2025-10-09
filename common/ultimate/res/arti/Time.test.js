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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Databases')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Databases'],
        purple: ['Lighting'],
        museum: ['Museum 1', 'Time'],
      },
      micah: {
        green: ['Self Service'],
      },
    })
  })
})
