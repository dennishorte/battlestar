Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Camcorder", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Camcorder'],
      },
      micah: {
        hand: ['Sailing', 'Laser'],
      },
      decks: {
        base: {
          9: ['Fission'],
        },
        echo: {
          9: ['Calculator', 'Rock', 'Helicopter'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Camcorder')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Camcorder'],
        blue: ['Laser'],
        hand: ['Calculator', 'Rock', 'Helicopter'],
      },
      micah: {
        hand: ['Fission'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Touchscreen'],
        forecast: ['Camcorder'],
      },
      micah: {
        hand: ['Sailing'],
      },
      decks: {
        base: {
          9: ['Fission'],
        },
        echo: {
          9: ['Calculator', 'Rock', 'Helicopter'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Touchscreen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Camcorder'],
        blue: ['Touchscreen'],
        hand: ['Sailing'],
      },
      micah: {
        hand: ['Fission'],
      },
    })
  })
})
