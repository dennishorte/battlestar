Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Homing Pigeons", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Homing Pigeons', 'Sailing'],
        hand: ['The Wheel', 'Machinery'],
      },
      micah: {
        score: ['Tools', 'Calendar', 'Engineering'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Homing Pigeons')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Homing Pigeons', 'Sailing'],
          splay: 'left'
        },
        hand: ['The Wheel', 'Machinery'],
      },
      micah: {
        score: ['Calendar'],
      }
    })
  })
})
