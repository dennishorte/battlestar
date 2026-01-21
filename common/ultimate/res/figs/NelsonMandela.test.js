Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nelson Mandela', () => {
  describe('If you would dogma a card as your second action, instead super-execute the card.', () => {
    test('karma: dogma card as second action, super-execute instead', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          hand: [],
        },
        micah: {
          green: ['The Wheel'], // The Wheel on top (to dogma it)
          red: ['Nelson Mandela'], // Nelson Mandela on micah's board
          hand: [],
        },
        decks: {
          base: {
            1: ['Sailing', 'Tools', 'Agriculture', 'Pottery'], // Cards to draw (The Wheel draws two {1} for both players)
            9: ['Fission'],
          },
        },
      })

      let request
      request = game.run()
      // First round: dennis takes first action (Draw) - first player only gets one action
      request = t.choose(game, request, 'Draw.draw a card')
      // micah's turn (first round, gets two actions)
      // First action: Draw
      request = t.choose(game, request, 'Draw.draw a card')
      // Second action: Dogma The Wheel (on micah's board)
      request = t.choose(game, request, 'Dogma.The Wheel')
      // Karma triggers: instead of normal dogma, super-execute The Wheel
      // The Wheel's dogma: "Draw two {1}."
      // Super-execute means all opponents are demanded (not just the owner)
      // micah is the owner, so he is NOT demanded
      // dennis is an opponent, so dennis IS demanded and must draw two {1}
      // micah also draws two {1} (as owner)
      // Note: After second action completes, turn should advance to dennis

      t.testBoard(game, {
        dennis: {
          hand: ['Sailing'], // dennis was demanded and drew one {1} (only one card available in deck)
        },
        micah: {
          green: ['The Wheel'], // The Wheel was super-executed (not normal dogma)
          red: ['Nelson Mandela'],
          hand: ['Agriculture', 'Fission', 'Tools'], // micah drew cards (actual cards from draws)
        },
      })
    })
  })

  describe('Each two {p} on your board counts as an achievement.', () => {
    test('karma: one {p} biscuit, no extra achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Nelson Mandela'], // Nelson Mandela has {p} biscuit
          blue: ['Tools'], // Tools has no {p}
        },
      })
      // dennis has 1 {p} biscuit (from Nelson Mandela), so 0 extra achievements (need 2 for 1 achievement)

      expect(t.dennis(game).achievementCount().other.length).toBe(0)
    })

    test('karma: two {p} biscuits, one extra achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Nelson Mandela'], // Nelson Mandela has {p} biscuit
          purple: ['H.G. Wells'], // H.G. Wells has {p} biscuit
        },
      })
      // dennis has 2 {p} biscuits (from Nelson Mandela and H.G. Wells), so 1 extra achievement

      let request
      request = game.run()

      expect(t.dennis(game).achievementCount().other.length).toBe(1)
    })

    test('karma: four {p} biscuits, two extra achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Nelson Mandela'], // Nelson Mandela has {p} biscuit
          purple: ['H.G. Wells'], // H.G. Wells has {p} biscuit
          yellow: ['Near-Field Comm'], // Near-Field Comm has {p} biscuit (hcpp)
        },
      })
      // dennis has 4 {p} biscuits, so 2 extra achievements

      let request
      request = game.run()

      expect(t.dennis(game).achievementCount().other.length).toBe(2)
    })
  })
})
