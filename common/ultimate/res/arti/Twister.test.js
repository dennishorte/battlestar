Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Twister", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Twister"],
      },
      micah: {
        red: ['Coal'],
        score: ['Sailing', 'Navigation', 'Mathematics', 'Oars']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 'Mathematics')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Twister'],
      },
      micah: {
        red: ['Oars', 'Coal'],
        green: ['Sailing'],
        blue: ['Mathematics'],
        score: ['Navigation'],
      },
    })
  })
})
