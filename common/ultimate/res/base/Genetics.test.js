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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Genetics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Climatology'],
        score: ['Genetics', 'Tools'],
      },
    })
  })
})
