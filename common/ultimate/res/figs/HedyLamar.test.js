Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hedy Lamar', () => {

  describe('karma: achievements', () => {

    test('Empire', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Mobility', 'Road Building'],
            splay: 'left'
          },  // ffikk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          hand: ['Hedy Lamar'], // ii
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Hedy Lamar')
      request = t.choose(game, request, 'red')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Mobility', 'Road Building'],
            splay: 'up'
          },  // ffikk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          green: ['Hedy Lamar'], // ii
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          achievements: ['Empire'],
        },
      })
    })

    test('Empire, one less kind of biscuit (f)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Road Building', 'Mobility'],
            splay: 'left'
          },  // fkkk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          hand: ['Hedy Lamar'], // ii
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Hedy Lamar')
      request = t.choose(game, request, 'yellow')

      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Road Building', 'Mobility'],
            splay: 'left'
          },  // fkkk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'up'
          }, // ccflll
          green: ['Hedy Lamar'], // ii
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          achievements: ['Empire'],
        },
      })
    })
  })

  describe('If you would claim an achievement, first splay a color of your cards up.', () => {
    test('karma: claim achievement, splay a color up first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Hedy Lamar'], // Owner of karma card
          red: ['Archery', 'Road Building'], // Red cards (need at least 2 to splay)
          score: ['Tools', 'Sailing', 'Agriculture', 'Metalworking', 'Mathematics', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers'], // Score to meet achievement requirement (need 20 for Invention)
        },
      })

      let request
      request = game.run()
      // dennis (owner) claims an achievement
      // Use nested format: 'Achieve.AchievementName'
      request = t.choose(game, request, 'Achieve.Invention')
      // Karma triggers: first splay a color up (would-first)
      // chooseAndSplay is optional (min: 0), so we can choose a color or skip
      request = t.choose(game, request, 'red') // Choose red to splay up
      // Then achievement is claimed automatically

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Hedy Lamar'],
          red: {
            cards: ['Archery', 'Road Building'],
            splay: 'up', // Red was splayed up by karma
          },
          achievements: ['Invention'], // Achievement was claimed
          score: ['Tools', 'Sailing', 'Agriculture', 'Metalworking', 'Mathematics', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers'], // Score cards remain (not consumed)
        },
      })
    })

    test('karma: claim achievement, multiple colors available to splay', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Hedy Lamar'], // Owner of karma card
          red: ['Archery', 'Road Building'], // Red cards (need at least 2 to splay)
          blue: ['Tools', 'Mathematics'], // Blue cards (need at least 2 to splay)
          yellow: ['Agriculture', 'Canal Building'], // Yellow cards (need at least 2 to splay)
          score: ['Sailing', 'Metalworking', 'Experimentation', 'Writing', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers', 'Robotics'], // Score to meet achievement requirement (need 20 for Invention age 1)
        },
      })

      let request
      request = game.run()
      // dennis (owner) claims an achievement
      request = t.choose(game, request, 'Achieve.Invention')
      // Karma triggers: first splay a color up (would-first)
      request = t.choose(game, request, 'blue') // Choose blue to splay up
      // Then achievement is claimed automatically

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Hedy Lamar'],
          red: ['Archery', 'Road Building'], // Not splayed
          blue: {
            cards: ['Tools', 'Mathematics'],
            splay: 'up', // Blue was splayed up by karma
          },
          yellow: ['Agriculture', 'Canal Building'], // Not splayed
          achievements: ['Invention'], // Achievement was claimed
          score: ['Sailing', 'Metalworking', 'Experimentation', 'Writing', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers', 'Robotics'], // Score cards remain (not consumed)
        },
      })
    })

    test('karma: claim achievement, color already splayed up', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Hedy Lamar'], // Owner of karma card
          red: {
            cards: ['Archery', 'Road Building'],
            splay: 'up', // Already splayed up
          },
          score: ['Tools', 'Sailing', 'Agriculture', 'Metalworking', 'Mathematics', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers'], // Score to meet achievement requirement (need 20 for Invention)
        },
      })

      let request
      request = game.run()
      // dennis (owner) claims an achievement
      request = t.choose(game, request, 'Achieve.Invention')
      // Karma triggers: first splay a color up (would-first)
      // Red is already splayed up, so it's filtered out by chooseAndSplay
      // Since no colors are available to splay, chooseAndSplay returns [] and logs "no effect"
      // No selection needed - achievement is claimed automatically

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Hedy Lamar'],
          red: {
            cards: ['Archery', 'Road Building'],
            splay: 'up', // Already splayed up (no change)
          },
          achievements: ['Invention'], // Achievement was claimed
          score: ['Tools', 'Sailing', 'Agriculture', 'Metalworking', 'Mathematics', 'Philosophy', 'Engineering', 'Industrialization', 'Atomic Theory', 'Computers'], // Score cards remain (not consumed)
        },
      })
    })
  })
})
