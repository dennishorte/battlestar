Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Wernher Von Braun', () => {

  test('inspire and karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Wernher Von Braun'],
      },
      decks: {
        base: {
          9: ['Fission'],
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Wernher Von Braun'],
        hand: ['Fission'],
        forecast: ['Software'],
        score: ['Software'],
      },
    })
  })

})
