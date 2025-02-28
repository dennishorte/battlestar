Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Currency', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Currency'],
        hand: ['Gunpowder', 'Reformation', 'The Wheel'],
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Currency')
    const request3 = t.choose(game, request2, 'Gunpowder', 'Reformation', 'The Wheel')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Currency'],
        score: ['Calendar', 'Fermenting'],
      },
    })
  })

})
