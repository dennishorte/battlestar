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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Education')
    request = t.choose(game, request, 'yes')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Education')
    request = t.choose(game, request, 'no')

    t.testBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['The Wheel', 'Code of Laws', 'Calendar', 'Enterprise'],
      },
    })
  })

})
