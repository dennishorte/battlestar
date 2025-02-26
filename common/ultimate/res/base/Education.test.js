Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Education', () => {

  test('return a card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['The Wheel', 'Code of Laws', 'Calendar', 'Enterprise'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Education')
    const request3 = t.choose(game, request2, 'yes')

    t.testBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['The Wheel', 'Code of Laws', 'Calendar'],
        hand: ['Gunpowder'],
      },
    })
  })

  test('do nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['The Wheel', 'Code of Laws', 'Calendar', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Education')
    const request3 = t.choose(game, request2, 'no')

    t.testBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['The Wheel', 'Code of Laws', 'Calendar', 'Enterprise'],
      },
    })
  })

})
