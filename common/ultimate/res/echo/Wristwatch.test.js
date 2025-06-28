Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Wristwatch", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Wristwatch'],
        red: ['Coal', 'Plumbing'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
          10: ['Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Wristwatch')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Wristwatch', 'Fermenting'],
        red: ['Plumbing', 'Coal'],
        blue: ['Software'],
      },
    })
  })
})
