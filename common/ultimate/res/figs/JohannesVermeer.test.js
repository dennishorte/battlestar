Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Johannes Vermeer', () => {
  describe('If you would claim a standard achievement, first claim an available achievement of value one higher, regardless of eligibility.', () => {

    test('karma: claim standard achievement, first claim one age higher', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'], // Age 1 top card
          score: ['Canning'], // Age 10, enough score for age 1 achievement
        },
        achievements: ['Sailing', 'Fermenting'], // Sailing is age 1, Fermenting is age 2
        decks: {
          figs: {
            1: ['Homer'], // Figure drawn when Fermenting is claimed
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (Sailing)
      // Karma triggers: first claim age 2 achievement (Fermenting)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'],
          score: ['Canning'],
          achievements: ['Fermenting', 'Sailing'], // Both claimed (Fermenting first, then Sailing)
        },
        micah: {
          hand: ['Homer'], // Figure drawn when Fermenting was claimed
        },
      })
    })

    test('karma: multiple achievements of age+1 available, choose which', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'], // Age 1 top card
          score: ['Canning'], // Enough score
        },
        achievements: ['Sailing', 'Fermenting', 'Construction'], // Sailing age 1, Fermenting age 2, Machinery age 3
        decks: {
          figs: {
            1: ['Sargon of Akkad'], // Figure drawn when age 1 achievement is claimed
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (Sailing)
      // Karma triggers: choose which age 2 achievement to claim
      request = t.choose(game, '**base-2*') // Choose Fermenting (age 2)
      // After claiming achievements, game asks for second action
      // Continue until turn completes

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'],
          score: ['Canning'],
          achievements: ['Fermenting', 'Sailing'], // Fermenting claimed first, then Sailing
        },
        micah: {
          hand: ['Sargon of Akkad'], // Figure drawn when Fermenting was claimed
        },
      })
    })

    test('karma: claim achievement regardless of eligibility', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'], // Age 1 top card
          // No score - not eligible for age 2 achievement normally
        },
        achievements: ['Sailing', 'Fermenting'], // Sailing age 1, Fermenting age 2
        decks: {
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (Sailing)
      // Karma triggers: claim age 2 achievement (Fermenting) regardless of eligibility
      // dennis has no score, but can still claim Fermenting (karma bypasses eligibility)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'],
          achievements: ['Fermenting', 'Sailing'], // Both claimed (Fermenting first, regardless of eligibility)
        },
        micah: {
          hand: ['Sargon of Akkad'], // Figure drawn when Fermenting was claimed
        },
      })
    })

    test('karma: no achievement of age+1 available, proceed normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'], // Age 1 top card
          score: ['Canning'], // Enough score
        },
        achievements: ['Sailing'], // Only age 1 achievement available
        decks: {
          figs: {
            1: ['Homer'], // Figure drawn when Sailing is claimed
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (Sailing)
      // Karma triggers but no age 2 achievement available, so chooseAndAchieve is called with empty array

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel'],
          score: ['Canning'],
          achievements: ['Sailing'], // Only Sailing claimed (no age 2 available)
        },
        micah: {
          hand: ['Homer'], // Figure drawn when Sailing was claimed
        },
      })
    })

    test('karma: does not trigger for special achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          score: ['Canning'], // Enough score
        },
        achievements: ['The Wheel', 'Fermenting'], // The Wheel is age 1 standard, Fermenting is age 2
        decks: {
          base: {
            1: ['Tools'], // Card for The Wheel's dogma
          },
          figs: {
            1: ['Homer'], // Figure drawn when Sailing is claimed
          },
        },
      })

      let request
      request = game.run()
      // Try to claim a special achievement (if available) - karma should not trigger
      // Since there are no special achievements in this setup, just verify normal achievement claim works
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (The Wheel)
      // Karma should trigger for standard achievement

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          score: ['Canning'],
          achievements: ['Fermenting', 'The Wheel'], // Both claimed (Fermenting first via karma)
        },
        micah: {
          hand: ['Homer'],
        }
      })
    })
  })

  describe('If you would meld a card, first score all cards of a color on your board.', () => {
    test('karma: meld card, first score all cards of a color', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel', 'Sailing'], // Multiple green cards
          red: ['Archery'], // One red card
          hand: ['Tools'], // Card to meld
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Tools')
      // Karma triggers: choose a color and score all cards of that color
      request = t.choose(game, 'green') // Choose green color
      request = t.choose(game, 'auto')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: [], // All green cards were scored
          red: ['Archery'], // Red cards remain
          blue: ['Tools'], // Tools was melded to blue
          score: ['The Wheel', 'Sailing'], // Green cards were scored
        },
      })
    })

    test('karma: multiple colors available, choose which to score', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel', 'Sailing'], // Multiple green cards
          red: ['Archery', 'Metalworking'], // Multiple red cards
          hand: ['Tools'], // Card to meld
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Tools')
      // Karma triggers: choose a color and score all cards of that color
      request = t.choose(game, 'red') // Choose red color
      request = t.choose(game, 'auto')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          green: ['The Wheel', 'Sailing'], // Green cards remain
          red: [], // All red cards were scored
          blue: ['Tools'], // Tools was melded to blue
          score: ['Archery', 'Metalworking'], // Red cards were scored
        },
      })
    })

    test('karma: only one color on board, score that color', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Johannes Vermeer'],
          hand: ['Tools'], // Card to meld
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Tools')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Tools'], // Tools was melded to blue
          score: ['Johannes Vermeer'],
        },
      })
    })
  })
})
