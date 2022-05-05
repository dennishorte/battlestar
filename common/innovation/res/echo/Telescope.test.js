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
        base: {
          5: ['Metric System']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Telescope')
    const request3 = t.choose(game, request2, 'Metric System')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Telescope'],
        score: ['Software'],
        achievements: ['Sailing'],
      },
    })
  })
})
