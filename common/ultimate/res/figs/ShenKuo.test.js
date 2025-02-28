Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shen Kuo', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Shen Kuo', 'The Wheel'],
        blue: ['Computers', 'Experimentation'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Shen Kuo', 'The Wheel'],
        blue: {
          cards: ['Computers', 'Experimentation'],
          splay: 'left'
        },
        hand: ['Machinery'],
      },
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Shen Kuo', 'The Wheel'],
        blue: {
          cards: ['Computers', 'Experimentation'],
          splay: 'left'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'up'
        }
      },
    })

    const request1 = game.run()

    expect(game.getScore(t.dennis(game))).toBe(6)
  })
})
