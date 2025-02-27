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
          11: ['Climatology'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Genetics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Climatology'],
        score: ['Genetics', 'Tools'],
      },
    })
  })
})
