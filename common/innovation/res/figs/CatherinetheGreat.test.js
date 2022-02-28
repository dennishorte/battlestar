Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Catherine the Great', () => {

  test('inspire (no leaf, so no karma trigger)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Catherine the Great'],
      },
      decks: {
        base: {
          6: ['Industrialization', 'Vaccination']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Archery'],
        purple: ['Catherine the Great'],
        hand: ['Vaccination'],
      },
    })
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Catherine the Great'],
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).s).toBe(9)
  })

  test('karma: meld purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Catherine the Great', 'Enterprise'],
      },
      decks: {
        base: {
          6: ['Democracy', 'Vaccination']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        purple: ['Democracy', 'Enterprise'],
        hand: ['Catherine the Great', 'Vaccination'],
      },
    })
  })
})
