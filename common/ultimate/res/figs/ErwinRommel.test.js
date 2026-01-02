Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Erwin Rommel', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Erwin Rommel', 'War')
  })

  describe('If you would score a non-figure, instead score the top card of its color from all boards, and score a card in any score pile.', () => {
    test('karma: score figure, proceeds normally (karma does not trigger)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Erwin Rommel'],
          purple: ['Philosophy'], // Card with score effect
          hand: ['Carl Friedrich Gauss'], // Figure to score
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Carl Friedrich Gauss') // Score figure
      // Karma does NOT trigger (only triggers for non-figures)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Erwin Rommel'],
          purple: ['Philosophy'],
          score: ['Carl Friedrich Gauss'], // Figure scored normally
          hand: [],
        },
      })
    })

    test('karma: score non-figure, score top cards of color from all boards and card from score pile', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Erwin Rommel'],
          purple: ['Philosophy'], // Card with score effect
          blue: ['Writing'], // Top blue card on dennis's board
          yellow: ['Fermenting'],
          hand: ['Tools'], // Age 1, blue - non-figure to score
        },
        micah: {
          blue: ['Mathematics'], // Top blue card on micah's board
          score: ['The Wheel'], // Card in opponent's score pile
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Tools') // Score Tools (blue, age 1, non-figure)
      // Karma triggers: instead of scoring Tools, score top blue cards from all boards
      request = t.choose(game, request, 'auto') // Auto-order/score all top blue cards

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Erwin Rommel'],
          purple: ['Philosophy'],
          yellow: ['Fermenting'],
          blue: [], // Writing was scored
          score: ['Writing', 'Mathematics', 'The Wheel'], // Top blue cards from both boards + card from score pile
          hand: ['Tools'],
        },
        micah: {
          blue: [], // Mathematics scored
          score: [], // The Wheel scored
        },
      })
    })

  })

})
