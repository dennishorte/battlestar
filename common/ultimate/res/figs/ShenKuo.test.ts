Error.stackTraceLimit = 100
import t from '../../testutil.js'

describe('Shen Kuo', () => {

  describe('If you would score a non-figure, instead splay that card\'s color right.', () => {
    test('karma: score non-figure card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          yellow: ['Agriculture'], // Agriculture must be on top to dogma it
          red: ['Archery', 'Metalworking'], // Need at least 2 cards to splay
          hand: ['The Wheel'], // Age 1 card to return
        },
        decks: {
          base: {
            2: ['Construction'], // Will be drawn and "scored" (age 2, red) but splayed to red instead
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'The Wheel') // Return The Wheel (age 1) to trigger scoring
      // Agriculture draws and "scores" Construction (age 2, red)
      // Karma intercepts and splays red right instead

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          yellow: ['Agriculture'],
          red: {
            cards: ['Archery', 'Metalworking'],
            splay: 'right', // Construction's color (red) was splayed right instead of scoring
          },
          hand: ['Construction'], // Construction was drawn but not scored (karma intercepted)
        },
      })
    })

    test('karma: does not trigger for figure cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          purple: ['Philosophy'], // Philosophy must be on top to dogma it
          hand: ['Peter the Great'], // Figure card in hand to score
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Peter the Great') // Score Peter the Great (figure)
      // No fade check needed - only have 1 figure on board

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          purple: ['Philosophy'],
          score: ['Peter the Great'], // Figure was scored normally (karma doesn't trigger)
        },
      })
    })
  })

  describe('If you would splay a color left, instead splay that color right.', () => {
    test('karma: splay left becomes splay right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          purple: ['Philosophy'],
          red: ['Construction', 'Archery'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'red') // Choose to splay red left

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          purple: ['Philosophy'],
          red: {
            cards: ['Construction', 'Archery'],
            splay: 'right', // Should be right, not left
          },
        },
      })
    })

    test('karma: does not affect other splay directions', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          red: {
            cards: ['Flight', 'Archery'],
            splay: 'up', // Red already splayed up
          },
          blue: ['Tools', 'Experimentation'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Flight')
      request = t.choose(game, request, 'blue') // Splay blue up (not left)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Shen Kuo'],
          red: {
            cards: ['Flight', 'Archery'],
            splay: 'up',
          },
          blue: {
            cards: ['Tools', 'Experimentation'],
            splay: 'up', // Should be up, not affected by karma
          },
        },
      })
    })
  })

  describe('Each visible card on your board provides an additional point towards your score.', () => {
    test('karma: calculate score with visible cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo', 'The Wheel'],
          blue: {
            cards: ['Computers', 'Experimentation'],
            splay: 'left',
          },
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'up',
          },
        },
      })

      let request
      request = game.run()

      // With splay left on blue: 2 visible cards
      // With splay up on red: 2 visible cards
      // With no splay on green: 1 visible card (only top card counts)
      // Total: 2 + 2 + 1 = 5 points
      expect(game.getScore(t.dennis(game))).toBe(5)
    })

    test('karma: calculate score with no splay', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Shen Kuo', 'The Wheel'],
          blue: ['Computers', 'Experimentation'],
          red: ['Archery'],
        },
      })

      let request
      request = game.run()

      // With no splay: only top card counts
      // green: 1, blue: 1, red: 1 = 3 points
      expect(game.getScore(t.dennis(game))).toBe(3)
    })
  })
})
