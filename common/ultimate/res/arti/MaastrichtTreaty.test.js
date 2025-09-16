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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Maastricht Treaty')
  })
})
