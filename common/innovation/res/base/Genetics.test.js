Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Genetics', () => {

  test('dogma (nuclear war)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Genetics', 'Tools'],
      },
      decks: {
        base: {
          10: ['Software'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Genetics')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Software'],
        score: ['Genetics', 'Tools'],
      },
    })
  })
})
