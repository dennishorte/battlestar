Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Victory achievement', () => {
  test('tucked', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Escapism', 'Monotheism'],
          splay: 'right',
        },
        hand: ['Shanghai'],
      },
      decks: {
        base: {
          8: ["Quantum Theory", "Rocketry", "Socialism"],
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
        hand: ["Quantum Theory", "Rocketry", "Socialism"],
        achievements: ['Victory'],
      }
    })
  })
})
