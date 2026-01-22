Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Johannes Kepler', () => {

  describe('If you would take a Dogma action, instead do so while increasing each {} value in every effect during this action by the number of different top card values on your board greater than 3.', () => {
    test('karma: dogma action, increase {} values by number of different top card ages > 3', () => {
      // Test with 2 different top card ages > 3 (Johannes Kepler age 4, Canning age 6)
      // So {1} should become {3} (1 + 2 = 3)
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'], // Age 4, > 3
          yellow: ['Canning'], // Age 6, > 3
          green: ['The Wheel'], // Age 1 card to dogma
        },
        decks: {
          base: {
            3: ['Engineering', 'Translation'], // Age 3 cards (1 + 2 increase)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // The Wheel draws two {1}, which become {3} (1 + 2 increase)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'],
          yellow: ['Canning'],
          green: ['The Wheel'],
          hand: ['Engineering', 'Translation'], // Drew age 3 cards (1 + 2 increase)
        },
      })
    })

    test('karma: single top card age > 3, increase by 1', () => {
      // Test with 1 top card age > 3 (Johannes Kepler age 4)
      // So {1} should become {2} (1 + 1 = 2)
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'], // Age 4, > 3
          green: ['The Wheel'], // Age 1, not > 3
        },
        decks: {
          base: {
            2: ['Calendar', 'Construction'], // Age 2 cards (1 + 1 increase)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'],
          green: ['The Wheel'],
          hand: ['Calendar', 'Construction'], // Drew age 2 cards (1 + 1 increase)
        },
      })
    })

    test('karma: multiple cards of same age > 3, count only once', () => {
      // Test with 2 top cards both age 4 (should count as 1 unique age)
      // So {1} should become {2} (1 + 1 = 2), not {3}
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'], // Age 4, > 3
          purple: ['Reformation'], // Age 4, > 3 (same age, should count once)
          green: ['The Wheel'], // Age 1, not > 3
        },
        decks: {
          base: {
            2: ['Calendar', 'Construction'], // Age 2 cards (1 + 1 increase, not 1 + 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'],
          purple: ['Reformation'],
          green: ['The Wheel'],
          hand: ['Calendar', 'Construction'], // Drew age 2 cards (1 + 1 increase)
        },
      })
    })

    test('karma: three different top card ages > 3, increase by 3', () => {
      // Test with 3 different top card ages > 3 (ages 4, 5, 6)
      // So {1} should become {4} (1 + 3 = 4)
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'], // Age 4, > 3
          purple: ['Societies'], // Age 5, > 3
          red: ['Industrialization'], // Age 6, > 3
          green: ['The Wheel'], // Age 1, not > 3
        },
        decks: {
          base: {
            4: ['Experimentation', 'Reformation'], // Age 4 cards (1 + 3 increase)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Johannes Kepler'],
          purple: ['Societies'],
          red: ['Industrialization'],
          green: ['The Wheel'],
          hand: ['Experimentation', 'Reformation'], // Drew age 4 cards (1 + 3 increase)
        },
      })
    })
  })

})
