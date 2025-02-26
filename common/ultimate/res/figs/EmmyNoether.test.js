Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emmy Noether', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Emmy Noether'],
      },
      decks: {
        base: {
          8: ['Antibiotics', 'Flight']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testBoard(game, {
      dennis: {
        green: ['Emmy Noether'],
        yellow: ['Antibiotics'],
        hand: ['Flight'],
      },
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Emmy Noether'],
        blue: ['Software'],
        score: ['Calendar'],
      },
    })

    const request1 = game.run()

    expect(game.getScore(t.dennis(game))).toBe(27)
  })
})
