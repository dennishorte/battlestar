Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Glassblowing", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Glassblowing'],
        yellow: ['Canning'],
        hand: ['Candles', 'Tools'],
      },
      decks: {
        echo: {
          9: ['Rock'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Glassblowing')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Glassblowing'],
        yellow: ['Canning'],
        score: ['Candles'],
        hand: ['Tools'],
        forecast: ['Rock'],
      },
    })
  })
})
