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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Parachute')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Parachute'],
        hand: ['Sailing'],
      },
      micah: {
        hand: ['Lighting', 'Computers'],
      }
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Software'],
        forecast: ['Parachute'],
      },
      micah: {
        purple: ['Lighting', 'Code of Laws'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Software')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
      },
      micah: {
      },
      junk: ['Software', 'Parachute', 'Lighting', 'Code of Laws'],
    })
  })
})
