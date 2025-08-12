Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Telescope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Telescope'],
        score: ['Software'],
        forecast: ['Sailing'],
      },
      decks: {
        echo: {
          5: ['Lightning Rod'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Telescope')
    request = t.choose(game, request, 'Lightning Rod')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Telescope'],
        score: ['Software'],
        achievements: ['Sailing'],
      },
    })
  })
})
