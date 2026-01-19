Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Glory achievement', () => {
  test('junked', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Escapism', 'Monotheism'],
          splay: 'right',
        },
        hand: ['Tokyo'],
      },
      decks: {
        base: {
          5: ['Astronomy', 'Coal', 'Measurement'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Escapism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Escapism', 'Monotheism'],
          splay: 'right',
        },
        hand: ['Astronomy', 'Coal', 'Measurement'],
        achievements: ['Glory'],
      }
    })
  })
})
