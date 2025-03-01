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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Alex Trebek')

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
