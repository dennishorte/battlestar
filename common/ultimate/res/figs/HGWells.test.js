Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('H.G. Wells', () => {

  describe('If you would dogma a card using {s} as a featured icon, instead draw and junk a {0}, then super-execute the junked card.', () => {
    test('karma: dogma card with {s} featured icon, draw and junk age 10, super-execute it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['H.G. Wells'],
          blue: ['Tools'], // Tools has {s} as dogmaBiscuit
          hand: [],
        },
        micah: {
          hand: [],
        },
        decks: {
          base: {
            10: ['A.I.', 'Robotics'], // A.I. to draw and junk, Robotics to draw and score
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Tools')
      // Karma triggers: instead of dogmatizing Tools, draw and junk A.I. (age 10), then super-execute it
      // A.I.'s dogma: "Draw and score a {0}" and "If Robotics and Software are top cards on any board, the single player with the lowest score wins."
      // Super-execute means all opponents are demanded
      // A.I.'s first effect will draw and score an age 10 card for dennis
      // A.I.'s second effect will check the condition (won't trigger in this test)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['H.G. Wells'],
          blue: ['Tools'], // Tools was NOT dogmatized (would-instead prevented it)
          score: ['Robotics'], // Robotics was drawn and scored by A.I.'s first dogma effect
          // A.I. was drawn and junked, then super-executed (may not appear in junk if handled differently)
        },
        micah: {
          hand: [],
        },
        junk: ['A.I.'],
      })
    })

    test('karma: dogma card without {s} featured icon, normal dogma execution', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['H.G. Wells'],
          yellow: ['Agriculture'], // Agriculture has {l} as dogmaBiscuit, not {s}
          hand: [],
        },
        micah: {
          hand: [],
        },
        decks: {
          base: {
            2: ['Mathematics'], // Age 2 card (one higher than Agriculture age 1)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      // Karma does NOT trigger (Agriculture doesn't have {s} as featured icon)
      // Agriculture's dogma executes normally: "You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned."
      // Since dennis has no cards in hand, the effect has no effect

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['H.G. Wells'],
          yellow: ['Agriculture'], // Agriculture was dogmatized normally (karma did not trigger)
        },
        micah: {
          hand: [],
        },
        junk: []
      })
    })

    test('karma: super-execute demands all opponents (not self-execute)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['H.G. Wells'],
          blue: ['Tools'], // Tools has {s} as dogmaBiscuit
          yellow: ['Agriculture'], // Card with {l} for Globalization demand
          hand: [],
        },
        micah: {
          green: ['Sailing'], // Card with {l} for Globalization demand
          hand: [],
        },
        decks: {
          base: {
            10: ['Globalization'], // Age 10 card with simple demand effect (return one card)
            11: ['Climatology'], // Age 11 card (echo) for Globalization's second effect
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Tools')
      // Karma triggers: instead of dogmatizing Tools, draw and junk Globalization (age 10), then super-execute it
      // Globalization's first dogma: "I demand you return a top card with a {l} from your board!"
      // Super-execute means all opponents are demanded (not just the owner)
      // dennis is the owner, so he is NOT demanded
      // micah is an opponent, so micah IS demanded and must return Sailing (has {l})

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['H.G. Wells'], // Climatology was drawn and melded by Globalization's second effect (on top)
          blue: ['Climatology', 'Tools'], // Tools was NOT dogmatized (would-instead prevented it)
          yellow: ['Agriculture'], // Agriculture was NOT returned (dennis is owner, not demanded)
          // Globalization was drawn and junked, then super-executed
        },
        junk: ['Globalization'],
      })
    })
  })
})
