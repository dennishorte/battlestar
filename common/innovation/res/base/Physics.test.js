Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Physics')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Physics')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Physics'],
      },
    })
  })
})
