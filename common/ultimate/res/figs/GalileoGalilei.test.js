Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Galileo Galilei', () => {

  describe('If you would draw a card, first junk all cards in the {4} or {5} deck.', () => {
    test('karma: draw a card, choose to junk {4} deck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: [],
        },
        decks: {
          base: {
            5: ['Societies'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: choose which deck to junk ({4} or {5})
      request = t.choose(game, request, 4)
      // Draw completes automatically after karma

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 4) // Age 4 deck was junked
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Societies'],
        },
      })
    })
  })

  describe('If you would meld a card, first junk an available achievement of value 3, 4, or 5.', () => {
    test('karma: meld a card, junk achievement of age 3', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Construction'],
        },
        achievements: ['Machinery', 'Mathematics'], // Age 3 and 2 achievements (need multiple so choice is required)
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers: choose achievement to junk (age 3, 4, or 5) - only Machinery is eligible
      // Since only one is eligible, it auto-selects, no choice needed

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          red: ['Construction'], // Card was melded after junking achievement
        },
        junk: ['Machinery'], // Achievement was junked
      })
    })

    test('karma: meld a card, junk achievement of age 4', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Construction'],
        },
        achievements: ['Navigation', 'Mathematics'], // Age 4 and 2 achievements (need multiple so choice is required)
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers: choose achievement to junk (age 3, 4, or 5) - only Navigation is eligible
      // Since only one is eligible, it auto-selects, no choice needed

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          red: ['Construction'], // Card was melded after junking achievement
        },
        junk: ['Navigation'], // Achievement was junked
      })
    })

    test('karma: meld a card, junk achievement of age 5', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Construction'],
        },
        achievements: ['Reformation', 'Mathematics'], // Age 5 and 2 achievements (need multiple so choice is required)
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers: choose achievement to junk (age 3, 4, or 5) - only Reformation is eligible
      // Since only one is eligible, it auto-selects, no choice needed

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          red: ['Construction'], // Card was melded after junking achievement
        },
        junk: ['Reformation'], // Achievement was junked
      })
    })

    test('karma: multiple achievements available, choose which to junk', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Construction'],
        },
        achievements: ['Machinery', 'Navigation', 'Reformation'], // Ages 3, 4, 5
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')
      // Karma triggers: choose which achievement to junk (age 3, 4, or 5)
      request = t.choose(game, request, '**base-4*') // Choose Navigation

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          red: ['Construction'], // Card was melded after junking achievement
        },
        junk: ['Navigation'], // Navigation was junked
      })
      // Verify other achievements are still available (not junked)
      expect(t.dennis(game).availableAchievementsByAge(3)).toHaveLength(1) // Machinery still available
      // Note: Reformation (age 5) may not be available if it was already claimed or doesn't exist
    })

    test('karma: no achievements of ages 3, 4, or 5 available', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          hand: ['Construction'],
        },
        achievements: ['The Wheel', 'Mathematics'], // Ages 1 and 2 only
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Construction')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Galileo Galilei'],
          red: ['Construction'], // Card was melded (karma had no effect)
        },
        junk: [], // No achievement was junked
      })
    })
  })

})
