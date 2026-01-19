Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Jet", () => {

  test('dogma: melded', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Jet'],
        hand: ['Lighting'],
      },
      micah: {
        purple: ['Enterprise'],
      },
      decks: {
        echo: {
          10: ['Camcorder'],
        },
      },
      achievements: ['Reformation', 'Railroad'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jet')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Jet'],
        purple: ['Lighting'],
        forecast: ['Camcorder'],
      },
      junk: ['Reformation', 'Railroad'],
    })
  })

  test('dogma: no meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Jet'],
      },
      micah: {
        purple: ['Enterprise'],
      },
      decks: {
        echo: {
          10: ['Camcorder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jet')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Jet'],
        forecast: ['Camcorder'],
      },
      micah: {
        purple: ['Enterprise'],
      }
    })
  })
})
