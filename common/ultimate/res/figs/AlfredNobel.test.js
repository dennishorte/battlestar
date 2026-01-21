Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alfred Nobel', () => {

  describe('If a player would transfer a card, first junk all cards in the {7} deck.', () => {
    test('karma: player transfers card, junk age 7 deck first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Construction'], // Construction must be on top to dogma it
          green: ['Alfred Nobel'],
        },
        micah: {
          hand: ['Gunpowder', 'Currency'], // Cards to transfer
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn by Construction's dogma
          }
        },
        decksExact: {
          base: {
            7: ['Lighting', 'Sanitation'], // Age 7 cards to be junked (only these two in deck)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Construction')
      // Construction demands: transfer two cards from micah's hand
      // System auto-selects both cards (exactly 2 cards, need to select 2)
      // Then asks for order - use 'auto' since order doesn't matter
      request = t.choose(game, request, 'auto') // Auto-order the transfer
      // Construction's second effect draws a {2}
      // Karma triggers: junk all cards in age 7 deck first

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Construction'],
          green: ['Alfred Nobel'],
          hand: ['Gunpowder', 'Currency'], // Cards transferred
        },
        micah: {
          hand: ['Mathematics'], // Drew Mathematics from Construction's dogma
        },
      })
      t.testDeckIsJunked(game, 7)
    })

    test('karma: does not trigger on non-transfer actions', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['The Wheel', 'Alfred Nobel'], // The Wheel must be on top to dogma it
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Cards drawn by The Wheel
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      // Karma should NOT trigger (The Wheel does not transfer cards)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['The Wheel', 'Alfred Nobel'], // The Wheel stays on top after dogma
          hand: ['Tools', 'Sailing'], // Drew cards from The Wheel's dogma
        },
        junk: [], // Age 7 deck was NOT junked (karma did not trigger)
      })
    })
  })

  describe('Each standard icon type on your board counts as an achievement, if you have at least twice as many of that icon as every opponent.', () => {
    test('karma: icon type counts as achievement when player has at least twice as many', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Alfred Nobel'],
          red: ['Archery'],
        },
        micah: {
          red: ['Road Building'], // Road Building has 2 {k} (khkk) = 2 {k} total
        },
      })

      let request
      request = game.run()

      const achs = t.dennis(game).achievementCount()
      expect(achs.other.length).toBe(3) // {p}, {s}, and {c} icon types count as achievements
    })
  })
})
