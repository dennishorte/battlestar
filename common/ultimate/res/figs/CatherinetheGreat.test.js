Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Catherine the Great', () => {


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

    expect(t.dennis(game).biscuits().s).toBe(9)
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
