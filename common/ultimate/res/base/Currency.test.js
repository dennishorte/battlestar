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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Currency')
    request = t.choose(game, request, 'Gunpowder', 'Reformation', 'The Wheel')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Currency'],
        score: ['Calendar', 'Fermenting'],
      },
    })
  })

})
