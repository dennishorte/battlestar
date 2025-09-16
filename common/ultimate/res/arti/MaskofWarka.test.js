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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'blue')

    t.testIsFirstAction(request)
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
