Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Duke Ellington', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Duke Ellington']
      },
      decks: {
        base: {
          8: ['Antibiotics'],
        },
        figs: {
          8: ['Albert Einstein']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        purple: ['Duke Ellington'],
        blue: ['Albert Einstein'],
        hand: ['Antibiotics'],
      },
    })
  })

  test('karma: no fade', () => {
    t.testNoFade('Duke Ellington')
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Duke Ellington'],
        blue: ['Albert Einstein'],
        yellow: ['Shennong'],
        green: ['Fu Xi'],
        hand: ['Alex Trebek']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Alex Trebek')

    t.testBoard(game, {
      dennis: {
        purple: ['Duke Ellington'],
        blue: ['Albert Einstein'],
        yellow: ['Shennong'],
        green: ['Fu Xi'],
        achievements: ['Alex Trebek']
      },
    })
  })
})
