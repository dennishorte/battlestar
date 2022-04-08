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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Sailing')
    const request4 = t.choose(game, request3, 'Mathematics')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      micah: {
        red: ['Oars', 'Coal'],
        green: ['Sailing'],
        blue: ['Mathematics'],
        score: ['Navigation'],
      },
    })
  })
})
