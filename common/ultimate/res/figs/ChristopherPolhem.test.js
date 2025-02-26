Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Christopher Polhem', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem']
      },
      decks: {
        base: {
          4: ['Perspective'],
          5: ['Coal'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem', 'Perspective'],
        hand: ['Coal']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Christopher Polhem', 'Expansion')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem'],
        red: ['Coal']
      },
    })

    const request1 = game.run()

    expect(game.getScore(t.dennis(game))).toBe(10)
  })
})
