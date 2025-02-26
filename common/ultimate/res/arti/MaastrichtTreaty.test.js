Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Maastricht Treaty", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Maastricht Treaty"],
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software', 'Coal']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software', 'Coal']
      }
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Maastricht Treaty"],
        score: ['Tools', 'Sailing'],
      },
      micah: {
        score: ['Software']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Maastricht Treaty')
  })
})
