Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sailing', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Mysticism']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        purple: ['Mysticism'],
      },
    })
  })
})
