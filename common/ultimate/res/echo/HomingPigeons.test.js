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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Homing Pigeons')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'green')

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
