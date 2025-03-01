Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('William Shakespeare', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['William Shakespeare'],
        hand: ['Enterprise']
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise', 'William Shakespeare'],
        hand: ['Gunpowder'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('William Shakespeare', 'Rivalry')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['William Shakespeare', 'Enterprise', 'Education'],
          splay: 'up'
        },
        green: ['The Wheel'],
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(4 + 3)
  })
})
