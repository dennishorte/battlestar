Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
        echo: {
          3: ['Homing Pigeons', 'Sunglasses'],
          4: ['Pencil'],
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
        hand: ['Sunglasses', 'Pencil'],
      },
      micah: {
        green: ['Homing Pigeons', 'Sailing'],
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
        echo: {
          4: ['Pencil'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Charitable Trust')
    request = t.choose(game, request, 4)
    request = t.choose(game, request, 'Pencil')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pencil'],
        score: ['Software', 'Robotics'],
      },
    })
  })
})
