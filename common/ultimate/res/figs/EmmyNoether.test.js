Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emmy Noether', () => {
  test('karma: calculate-score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Emmy Noether'],
        blue: ['Software'],
        score: ['Calendar'],
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(18)
  })

  describe('If a player would score a card, first junk a card from that player\'s score pile.', () => {
    test('karma: score card, first junk a card from score pile', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Emmy Noether'],
          purple: ['Philosophy'], // Card with score effect
          hand: ['Tools'], // Card to score
          score: ['The Wheel', 'Calendar'], // Cards in score pile to choose from
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Tools') // Score Tools
      // Karma triggers: first junk a card from score pile
      request = t.choose(game, request, 'The Wheel') // Choose The Wheel to junk

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Emmy Noether'],
          purple: ['Philosophy'],
          score: ['Calendar', 'Tools'], // Calendar remains, Tools was scored
          hand: [], // Tools was scored
        },
        junk: ['The Wheel'], // The Wheel was junked
      })
    })

    test('karma: opponent scores card, junk from opponent score pile', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'], // Card with score effect
          hand: ['Tools'], // Card to score
          score: ['The Wheel'], // Card in dennis's score pile to be junked
        },
        micah: {
          green: ['Emmy Noether'], // Owner of karma
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Tools') // Dennis scores Tools
      // Karma triggers: first junk a card from dennis's score pile
      // Only The Wheel is available, so auto-selected

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          score: ['Tools'], // Tools was scored
          hand: [], // Tools was scored
        },
        micah: {
          green: ['Emmy Noether'],
        },
        junk: ['The Wheel'], // The Wheel was junked from dennis's score pile
      })
    })

    test('karma: score card when score pile is empty, no junk', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Emmy Noether'],
          purple: ['Philosophy'], // Card with score effect
          hand: ['Tools'], // Card to score
          score: [], // Empty score pile
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      request = t.choose(game, request, 'Tools') // Score Tools
      // Karma triggers: try to junk a card from score pile, but it's empty so nothing happens

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Emmy Noether'],
          purple: ['Philosophy'],
          score: ['Tools'], // Tools was scored
          hand: [], // Tools was scored
        },
      })
    })
  })
})
