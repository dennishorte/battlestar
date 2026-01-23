Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Murasaki Shikibu', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Murasaki Shikibu', 'Rivalry')
  })

  describe('If you would claim a standard achievement, instead you may junk a card from your score and then achieve the standard achievement if eligible. If you do, you may achieve the junked card if eligible.', () => {
    test('karma: junk card from score and achieve both', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'], // Age 3 top card - eligible for age 3 achievement
          score: ['Software', 'The Wheel', 'Mathematics', 'Construction', 'Tools'], // Have enough score even after junking
        },
        achievements: ['Sailing'], // Age 3 standard achievement
        decks: {
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*')
      // Karma triggers: choose to junk a card from score
      request = t.choose(game, 'The Wheel') // Junk The Wheel

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['Software', 'Mathematics', 'Construction', 'Tools'], // The Wheel was junked
          achievements: ['Sailing', 'The Wheel'], // Both achieved
        },
        micah: {
          hand: ['Sargon of Akkad'],
        },
        junk: [], // The Wheel was junked then achieved, so not in junk
      })
    })

    test('karma: skip junking, just achieve standard achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['The Wheel', 'Mathematics', 'Software'], // Eligible cards available
        },
        achievements: ['Machinery'], // Age 3 standard achievement
        decks: {
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-3*')
      // Karma triggers: choose to skip junking (min: 0)
      request = t.choose(game) // Empty selection = skip

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['The Wheel', 'Mathematics', 'Software'], // No cards junked
          achievements: ['Machinery'], // Only standard achievement achieved
        },
        micah: {
          hand: ['Sargon of Akkad'],
        },
      })
    })

    test('karma: no eligible cards in score, just achieve standard achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['Coal'], // Age 5, not eligible (need age 1-3 for standard achievements)
        },
        achievements: ['The Wheel'], // Age 1 standard achievement
        decks: {
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*')
      // Karma triggers but no eligible cards in score, so no choice needed

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['Coal'], // No cards junked
          achievements: ['The Wheel'], // Standard achievement achieved
        },
        micah: {
          hand: ['Sargon of Akkad'],
        },
      })
    })

    test('karma: neither is eligible after junking', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['The Wheel'],
        },
        achievements: ['Sailing'],
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*')
      // Karma triggers: choose to junk The Wheel
      request = t.choose(game, 'The Wheel')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: [],
        },
        junk: ['The Wheel'], // The Wheel was junked but not achieved
      })
    })

    test('karma: junked card not eligible after junking', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['Tools', 'Coal'],
        },
        achievements: ['Sailing'],
        decks: {
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*')
      // Karma triggers: choose to junk Tools
      request = t.choose(game, 'Tools')

      t.testIsSecondPlayer(game)
      // Navigation (age 4) might not be eligible if we don't have the right icons
      // But The Wheel should be achieved if eligible
      t.testBoard(game, {
        dennis: {
          purple: ['Murasaki Shikibu'],
          score: ['Coal'],
          achievements: ['Sailing'],
        },
        micah: {
          hand: ['Sargon of Akkad'],
        },
        junk: ['Tools'],
      })
    })
  })
})
