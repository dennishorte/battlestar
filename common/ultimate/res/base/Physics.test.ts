Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Physics', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Physics'],
        hand: ['Tools', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Canning', 'Atomic Theory', 'Machine Tools']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Physics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Physics'],
        hand: ['Tools', 'Calendar', 'Canning', 'Atomic Theory', 'Machine Tools'],
      },
    })
  })

  test('dogma (two match)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Physics'],
        hand: ['Tools', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Canning', 'Atomic Theory', 'Vaccination']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Physics')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Physics'],
      },
    })
  })
})
