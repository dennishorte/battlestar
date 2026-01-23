Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ruth Handler', () => {
  describe('If you would meld a card, first meld all other cards of that color from each player\'s hand, then draw and achieve a {9} for each card you meld in this way, regardless of eligibility.', () => {
    test('karma: meld card, other cards of same color in hands are melded, then draw and achieve {9}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Ruth Handler'], // Owner of karma card
          hand: ['Tools', 'Sailing', 'Experimentation'], // Tools is blue, Sailing is green
        },
        micah: {
          hand: ['Mathematics'], // Mathematics is blue (same color as Tools)
        },
        decks: {
          base: {
            9: ['Satellites', 'Computers'], // Age 9 cards to draw and achieve
          },
        },
      })

      let request
      request = game.run()
      // dennis (owner) melds Tools (blue)
      request = t.choose(game, 'Meld.Tools')
      // Karma triggers: meld all other blue cards from all players' hands
      request = t.choose(game, 'Experimentation')
      // Then draw and achieve a {9} for each card melded (1 card = Satellites)
      // The card is drawn and automatically achieved (no selection needed)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Ruth Handler'],
          blue: ['Tools', 'Mathematics', 'Experimentation'], // Tools melded, Mathematics melded by karma
          hand: ['Sailing'], // Sailing remains in hand (different color)
          achievements: ['Satellites', 'Computers'], // Satellites achieved by karma
        },
        micah: {
          hand: [], // Mathematics was melded by karma
        },
      })
    })

    test('karma: meld card, no other cards of same color in hands', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Ruth Handler'], // Owner of karma card
          hand: ['Tools'], // Tools is blue
        },
        micah: {
          hand: ['Sailing'], // Sailing is green (different color)
        },
      })

      let request
      request = game.run()
      // dennis (owner) melds Tools (blue)
      request = t.choose(game, 'Meld.Tools')
      // Karma triggers but no other blue cards in hands, so nothing happens

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Ruth Handler'],
          blue: ['Tools'], // Tools was melded normally
          achievements: [], // No achievements (no cards were melded by karma)
        },
        micah: {
          hand: ['Sailing'], // Sailing remains in hand (different color)
        },
      })
    })

  })
})
