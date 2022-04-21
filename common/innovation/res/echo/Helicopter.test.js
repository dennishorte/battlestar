Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Helicopter", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Helicopter'],
        blue: ['Software'],
        hand: ['Coal'],
      },
      micah: {
        yellow: ['Canning'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Helicopter')
    const request3 = t.choose(game, request2, 'Canning')
    const request4 = t.choose(game, request3, 'Coal')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Helicopter'],
        score: ['Software'],
      },
      micah: {
        score: ['Canning'],
      }
    })
  })
})
