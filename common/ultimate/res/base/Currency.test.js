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
    request = t.choose(game, 'Dogma.Currency')
    request = t.choose(game, 'Gunpowder', 'Reformation', 'The Wheel')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Currency'],
        score: ['Calendar', 'Fermenting'],
      },
    })
  })

})
