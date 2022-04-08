Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Where's Waldo", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Where's Waldo"],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'micah', "Where's Waldo")
  })
})
