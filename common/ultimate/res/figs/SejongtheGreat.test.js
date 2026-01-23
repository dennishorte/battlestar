Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sejong the Great', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Sejong the Great', 'Advancement')
  })

  describe('karma: meld card of same age as top red', () => {
    test('return card and draw and meld one age higher', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Gunpowder'], // Age 4 - top red card
          hand: ['Experimentation'], // Age 4, blue - same age as top red
        },
        decks: {
          base: {
            5: ['Banking'], // Age 5, green - will be drawn and melded (age 5 = age 4 + 1)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Experimentation')
      // Karma should trigger: Experimentation (age 4) matches top red (Gunpowder, age 4)
      // Should return Experimentation to deck and draw/meld Banking (age 5, green)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Gunpowder'],
          green: ['Banking'], // Drawn and melded (age 5, green)
          // Experimentation returned to deck (not in hand or on board)
        },
      })
    })

    test('does not trigger when card age does not match top red', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Gunpowder'], // Age 4 - top red card
          hand: ['The Wheel'], // Age 1 - different from top red
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.The Wheel')
      // Karma should not trigger - The Wheel (age 1) does not match Gunpowder (age 4)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Gunpowder'],
          green: ['The Wheel'], // Meld normally (karma did not trigger)
        },
      })
    })

    test('does not trigger when no top red card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          // No red cards
          hand: ['Experimentation'], // Age 4, blue
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Experimentation')
      // Karma should not trigger - no top red card

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Experimentation', 'Sejong the Great'], // Meld normally to blue (karma did not trigger)
        },
      })
    })

    test('works with different age top red card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Archery'], // Age 1 - top red card
          hand: ['The Wheel'], // Age 1, green - same age as top red
        },
        decks: {
          base: {
            2: ['Mapmaking'], // Age 2, green - will be drawn and melded (age 2 = age 1 + 1)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.The Wheel')
      // Karma triggers: The Wheel (age 1) matches top red (Archery, age 1)
      // Should return The Wheel and draw/meld Calendar (age 2, green)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Sejong the Great'],
          red: ['Archery'],
          green: ['Mapmaking'], // Drawn and melded (age 2, green)
          // The Wheel returned to deck (not in hand or on board)
        },
      })
    })
  })
})
