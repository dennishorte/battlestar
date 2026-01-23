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
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Glassblowing')
    request = t.choose(game, 2)

    t.testIsSecondPlayer(game)
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
