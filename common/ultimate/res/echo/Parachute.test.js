Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Parachute", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Parachute'],
      },
      micah: {
        hand: ['Lighting', 'Sailing', 'Computers'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Parachute')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Parachute'],
        hand: ['Lighting', 'Computers'],
      },
      micah: {
        hand: ['Sailing'],
      }
    })
  })
})
