Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Mysticism'],
        hand: ['Sailing'],
      },
    })
  })
})
