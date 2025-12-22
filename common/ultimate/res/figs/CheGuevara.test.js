Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Che Guevara', () => {
  describe('If you would meld a card, first draw and score a {9}. If the scored card is yellow, junk all cards in all score piles and all available standard achievements.', () => {
    test('karma: meld card, draw and score non-yellow {9}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Che Guevara'], // Owner of karma card
          hand: ['Tools'], // Card to meld
        },
        decks: {
          base: {
            9: ['Computers'], // Computers is blue (non-yellow)
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) melds Tools
      request = t.choose(game, request, 'Meld.Tools')
      // Karma triggers: draw and score a {9}
      // Computers (blue) is drawn and scored
      // Since Computers is not yellow, no additional effect

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Che Guevara'],
          blue: ['Tools'], // Tools was melded
          score: ['Computers'], // Computers was drawn and scored by karma
        },
      })
    })

    test('karma: meld card, draw and score yellow {9}, junk all score cards and achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Che Guevara'], // Owner of karma card
          hand: ['Tools'], // Card to meld
          score: ['The Wheel', 'Agriculture'], // Cards in dennis's score pile
        },
        micah: {
          score: ['Sailing', 'Metalworking'], // Cards in micah's score pile
        },
        decks: {
          base: {
            9: ['Suburbia'], // Suburbia is yellow (age 9)
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) melds Tools
      request = t.choose(game, request, 'Meld.Tools')
      // Karma triggers: draw and score a {9}
      // Suburbia (yellow) is drawn and scored
      // Since Suburbia is yellow, junk all cards in all score piles and all available standard achievements
      // junkMany requires selections when there are multiple cards
      // Use 'auto' to auto-select all cards (order doesn't matter)
      request = t.choose(game, request, 'auto')
      request = t.choose(game, request, 'auto')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Che Guevara'],
          blue: ['Tools'], // Tools was melded
          score: [], // All score cards were junked (including Suburbia)
        },
        micah: {
          score: [], // All score cards were junked
        },
        // Note: Available standard achievements were also junked, but the exact list varies
      })
    })
  })
})
