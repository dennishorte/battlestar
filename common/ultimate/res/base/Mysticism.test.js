Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mysticism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Mysticism'],
        green: ['The Wheel'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Code of Laws'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mysticism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Mysticism'],
        green: ['Sailing', 'The Wheel'],
        hand: ['Code of Laws'],
      },
    })
  })

  test('dogma (no match)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          1: ['Sailing'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mysticism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Mysticism'],
        hand: ['Sailing'],
      },
    })
  })
})
