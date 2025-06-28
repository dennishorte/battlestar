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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Charitable Trust')
    request = t.choose(game, request, 3)  // micah
    request = t.choose(game, request, 4)  // dennis
    request = t.choose(game, request, 'Homing Pigeons')  // micah
    request = t.choose(game, request) // dennis

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Charitable Trust')
    request = t.choose(game, request, 4)
    request = t.choose(game, request, 'Enterprise')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        score: ['Software', 'Robotics'],
        achievements: ['Charitable Trust'],
      },
    })
  })
})
