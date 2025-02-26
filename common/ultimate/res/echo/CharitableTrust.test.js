Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Charitable Trust", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Charitable Trust'],
      },
      micah: {
        green: ['Sailing'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
        },
        echo: {
          3: ['Homing Pigeons', 'Sunglasses'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Charitable Trust')
    const request3 = t.choose(game, request2, 3)  // micah
    const request4 = t.choose(game, request3, 4)  // dennis
    const request5 = t.choose(game, request4, 'Homing Pigeons')  // micah
    const request6 = t.choose(game, request5) // dennis

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        green: ['Charitable Trust'],
        hand: ['Sunglasses', 'Enterprise'],
      },
      micah: {
        green: ['Sailing'],
        hand: ['Tools']
      },
    })
  })

  test('dogma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Charitable Trust'],
        score: ['Software', 'Robotics'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Charitable Trust')
    const request3 = t.choose(game, request2, 4)
    const request4 = t.choose(game, request3, 'Enterprise')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        score: ['Software', 'Robotics'],
        achievements: ['Charitable Trust'],
      },
    })
  })
})
