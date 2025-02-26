Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Mask of Warka", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Mask of Warka"],
        hand: ['Sailing', 'Calendar', 'Software'],
      },
      achievements: ['The Wheel', 'Construction', 'Engineering', 'Computers', 'Robotics'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        hand: ['Sailing'],
        achievements: ['Construction', 'Robotics'],
      },
    })
  })

  test('dogma: opponent reveals', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Mask of Warka"],
        hand: ['Sailing', 'Calendar', 'Software'],
      },
      micah: {
        hand: ['Mathematics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'blue')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        hand: ['Sailing', 'Calendar', 'Software'],
      },
      micah: {
        hand: ['Mathematics'],
      },
    })
  })
})
