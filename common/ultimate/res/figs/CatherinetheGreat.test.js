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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

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

    let request
    request = game.run()

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        purple: ['Democracy', 'Enterprise'],
        hand: ['Catherine the Great', 'Vaccination'],
      },
    })
  })
})
