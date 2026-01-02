Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Marie Curie', () => {
  describe('Each different value present in your score pile above 6 counts as an achievement.', () => {
    test('karma: multiple distinct ages above 6 count as achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          score: ['Computers', 'Lighting', 'Canning', 'Coal'], // Ages: 9, 7, 6, 6
        },
      })

      let request
      request = game.run()

      // Ages above 6: 9 (Computers) and 7 (Lighting) = 2 distinct values
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
    })

    test('karma: duplicate ages above 6 only count once', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          score: ['Computers', 'Services', 'Lighting'], // Ages: 9, 9, 7 (two age 9 cards, but only one distinct age > 6)
        },
      })

      let request
      request = game.run()

      // Ages above 6: 9 (Computers, Services - same age, counts once), 7 (Lighting) = 2 distinct values
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
    })

    test('karma: no cards above 6, no extra achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          score: ['Canning', 'Coal', 'The Wheel'], // Ages: 6, 6, 1 (all <= 6)
        },
      })

      let request
      request = game.run()

      // No ages above 6, so no extra achievements
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(0)
    })

    test('karma: age 6 does not count', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          score: ['Canning', 'Lighting'], // Ages: 6, 7 (age 6 does not count, only 7)
        },
      })

      let request
      request = game.run()

      // Only age 7 (Lighting) counts, age 6 (Canning) does not
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(1)
    })
  })

  describe('If you would draw a card of a value not present in your hand, first draw a {9}.', () => {
    test('karma: draw card of age not in hand, first draw age 9', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'], // Writing on top (can dogma), Marie Curie below
          hand: ['Tools'], // Age 1 in hand
        },
        decks: {
          base: {
            8: ['Flight'],
            9: ['Computers'], // Age 9 to draw first
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card') // Writing draws age 2
      // Karma triggers: age 2 not in hand, so first draw age 9

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Marie Curie'], // Writing on top, Marie Curie below
          hand: ['Tools', 'Computers', 'Flight'], // Age 9 (Computers) drawn first by karma, then age 2 (Mathematics)
        },
      })
    })

    test('karma: draw card of age already in hand, no karma trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'], // Marie Curie on top (age 8, so draws age 8)
          hand: ['Flight'], // Age 8 in hand
        },
        decks: {
          base: {
            8: ['Rocketry'], // Age 8 to draw (already in hand)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card') // Draw action draws age 8
      // Karma does NOT trigger: age 8 is already in hand

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          hand: ['Flight', 'Rocketry'], // Only age 8 drawn (no age 9)
        },
      })
    })

    test('karma: empty hand, drawing any card triggers karma', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Marie Curie'], // Marie Curie on top (age 8, so draws age 8)
          hand: [], // Empty hand
        },
        decks: {
          base: {
            8: ['Flight'], // Age 8 to draw
            9: ['Computers'], // Age 9 to draw first
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card') // Draw action draws age 8
      // Karma triggers: hand is empty, so age 8 is not in hand, first draw age 9

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Marie Curie'],
          hand: ['Computers', 'Flight'], // Age 9 drawn first, then age 8
        },
      })
    })

  })
})
