Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Plato', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Plato', 'Rivalry')
  })

  test('karma: first action, splay succeeds', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Plato'],
        green: ['The Wheel', 'Sailing'], // Multiple cards in green for splay
        hand: [],
      },
      decks: {
        base: {
          1: ['Domestication', 'Metalworking'], // Cards that The Wheel will draw (draws two {1})
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.The Wheel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Plato'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left', // Green was splayed left by karma
        },
        hand: ['Domestication', 'Metalworking'],
      },
      junk: [], // No achievement was junked (splay succeeded)
    })
  })

  test('karma: first action, splay fails, junk achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Plato'],
        green: ['The Wheel'], // Only one card in green, so splay fails
        hand: [],
      },
      achievements: ['Sailing', 'Mathematics'], // Mathematics is age 2
      decks: {
        base: {
          1: ['Domestication', 'Metalworking'], // Cards that The Wheel will draw (draws two {1})
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.The Wheel')
    // Karma junks achievement - choose Mathematics (age 2)
    // The request should be for choosing an achievement to junk
    if (request && request.selectors && request.selectors.length > 0) {
      const selector = request.selectors[0]
      if (selector.title && selector.title.includes('achievement')) {
        request = t.choose(game, '**base-2*')
      }
    }

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Plato'],
        green: ['The Wheel'], // Green was not splayed (only one card)
        hand: ['Domestication', 'Metalworking'],
      },
      junk: ['Mathematics'], // Achievement of value 2 was junked
    })
  })

})
