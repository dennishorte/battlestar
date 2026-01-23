Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tracking', () => {
  test('dogma: draw two {z}, return one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        purple: ['Tracking'],
      },
      decks: {
        base: {
          0: ['Fire', 'Curing'], // Two age 0 cards to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Tracking')
    // Draws two age 0 cards (Fire and Curing)
    // Choose which one to return
    request = t.choose(game, 'Fire') // Return Fire

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Tracking'],
        hand: ['Curing'], // Curing kept in hand
      },
    })
  })
})
