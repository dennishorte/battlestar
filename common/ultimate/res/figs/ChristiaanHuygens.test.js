Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Christiaan Huygens', () => {
  describe('If you would dogma a card as your first action, instead junk all cards in the {6} deck. Then draw and reveal one {7}, two {8}, or three {9}. If the drawns cards have more {i} than you have on your board, return them.', () => {
    test('karma: first action dogma, junk age 6 deck, draw one age 7', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // Card to dogma
        },
        decks: {
          base: {
            6: ['Industrialization', 'Canning'], // Age 6 cards to be junked
            7: ['Explosives'], // Age 7 card to draw
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // Karma triggers: junk age 6 deck, then choose to draw
      request = t.choose(game, 'draw one 7') // Choose to draw one age 7

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 6) // Age 6 deck was junked
      t.testBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // The Wheel's dogma did NOT execute (would-instead)
          hand: ['Explosives'], // Age 7 card was drawn
        },
      })
    })

    test('karma: first action dogma, draw two age 8', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['Databases'], // Card to dogma
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card to be junked
            8: ['Skyscrapers', 'Rocketry'], // Age 8 cards to draw (Rocketry has 3 {i})
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Databases')
      // Karma triggers: junk age 6 deck, then choose to draw
      request = t.choose(game, 'draw two 8') // Choose to draw two age 8

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 6) // Age 6 deck was junked
      t.testBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['Databases'], // Databases dogma did NOT execute
          hand: ['Skyscrapers', 'Rocketry'], // Two age 8 cards were drawn
        },
      })
    })

    test('karma: first action dogma, draw three age 9', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // Card to dogma
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card to be junked
            9: ['Services', 'Suburbia', 'Specialization'], // Age 9 cards to draw (Satellites has 3 {i})
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // Karma triggers: junk age 6 deck, then choose to draw
      request = t.choose(game, 'draw three 9') // Choose to draw three age 9

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 6) // Age 6 deck was junked
      t.testBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // The Wheel's dogma did NOT execute
          hand: ['Services', 'Suburbia', 'Specialization'], // Three age 9 cards were drawn
        },
      })
    })

    test('karma: drawn cards have more {i} than on board, return them', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'], // Has {s} biscuit, no {i}
          green: ['The Wheel'], // Card to dogma
          // No {i} on board (0 clocks)
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card to be junked
            8: ['Rocketry', 'Skyscrapers'], // Age 8 cards: Rocketry has 3 {i} (iiih), Skyscrapers has 0 {i}
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // Karma triggers: junk age 6 deck, then choose to draw
      request = t.choose(game, 'draw two 8') // Choose to draw two age 8
      // Rocketry (3 {i}) + Skyscrapers (0 {i}) = 3 {i} total, dennis has 0, so return both
      request = t.choose(game, 'auto')

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 6) // Age 6 deck was junked
      t.testBoard(game, {
        dennis: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // The Wheel's dogma did NOT execute
          hand: [], // Both cards were returned (3 {i} > 0 {i} on board)
        },
      })
    })

    test('karma: does not trigger on second action', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        micah: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'], // Card to dogma
        },
        decks: {
          base: {
            1: ['Sailing', 'Tools', 'Mysticism'],
            5: ['Societies'],
          },
        },
      })

      let request
      request = game.run()
      // First action: Draw a card (first round only has one action)
      request = t.choose(game, 'Draw.draw a card')
      // Micah's turn - do one action to complete the round
      request = t.choose(game, 'Draw.draw a card')
      // Second action: Dogma The Wheel - karma should NOT trigger (actionNumber === 2)
      request = t.choose(game, 'Dogma.The Wheel')

      // Verify the key point: Christiaan Huygens's karma did not trigger
      // If it had triggered, The Wheel's dogma would NOT have executed (would-instead)
      // and dennis would have drawn cards from the karma instead
      t.testBoard(game, {
        dennis: {
          hand: ['Sailing'],
        },
        micah: {
          blue: ['Christiaan Huygens'],
          green: ['The Wheel'],
          hand: ['Societies', 'Tools', 'Mysticism'],
        },
      })
    })
  })
})
