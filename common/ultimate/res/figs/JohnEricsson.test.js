Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Ericsson', () => {

  describe('If you would dogma a card of a color an opponent has splayed right, first unsplay that color on an opponent\'s board.', () => {
    test('karma: dogma card, opponent has same color splayed right, unsplay it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson'], // John Ericsson on top (karma card)
          green: ['Sailing'], // Sailing on top (card to dogma - green)
        },
        micah: {
          green: {
            cards: ['The Wheel', 'Mapmaking'],
            splay: 'right', // Green splayed right
          },
        },
        decks: {
          base: {
            1: ['Tools'], // Card for Sailing's effect (draw and meld a {1})
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Sailing')
      // Karma triggers (would-first): unsplay green on micah's board
      // When only one opponent, choosePlayer auto-selects and unsplay happens immediately
      // Sailing's dogma executes: draw and meld a {1} (auto-melds, no choice needed)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson'],
          green: ['Sailing'],
          blue: ['Tools'], // Tools (blue) drawn and melded by Sailing
        },
        micah: {
          green: ['The Wheel', 'Mapmaking'], // Green unsplayed (splay: 'none')
        },
      })
    })

    test('karma: does not trigger if opponent color not splayed right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson'], // John Ericsson on top (karma card)
          green: ['Sailing'], // Sailing on top (card to dogma - green)
        },
        micah: {
          green: {
            cards: ['The Wheel', 'Mapmaking'],
            splay: 'left', // Green splayed left, not right
          },
        },
        decks: {
          base: {
            1: ['Tools'], // Card for Sailing's effect (draw and meld a {1})
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Sailing')
      // Karma should NOT trigger (green is splayed left, not right)
      // Sailing's dogma executes: draw and meld a {1} (auto-melds, no choice needed)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson'],
          green: ['Sailing'],
          blue: ['Tools'], // Tools (blue) drawn and melded by Sailing
        },
        micah: {
          green: {
            cards: ['The Wheel', 'Mapmaking'],
            splay: 'left', // Green remains splayed left (karma did not trigger)
          },
        },
      })
    })

    test('karma: multiple opponents with same color splayed right, choose which to unsplay', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson'], // John Ericsson on top (karma card)
          green: ['Sailing'], // Sailing on top (card to dogma - green)
        },
        micah: {
          green: {
            cards: ['The Wheel', 'Mapmaking'],
            splay: 'right', // Green splayed right
          },
        },
        scott: {
          green: {
            cards: ['Currency', 'Clothing'],
            splay: 'right', // Green also splayed right
          },
        },
        decks: {
          base: {
            1: ['Tools'], // Card for Sailing's effect (draw and meld a {1})
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Sailing')
      // Karma triggers (would-first): choose which opponent to unsplay
      request = t.choose(game, request, 'micah') // Choose to unsplay micah's green
      // Sailing's dogma executes: draw and meld a {1} (auto-melds, no choice needed)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson'],
          green: ['Sailing'],
          purple: ['Railroad'], // Initial pick in 3-player game
          yellow: ['Masonry'], // Initial pick in 3-player game
          hand: ['Alfred Nobel'], // Initial pick in 3-player game
        },
        micah: {
          green: ['The Wheel', 'Mapmaking'], // Green unsplayed (splay: 'none')
        },
        scott: {
          green: {
            cards: ['Currency', 'Clothing'],
            splay: 'right', // Green remains splayed right (not chosen)
          },
          blue: ['Tools'], // Tools (blue) drawn and melded by Sailing
        },
      })
    })
  })

  describe('If an opponent would draw a card, first draw and tuck a {7}.', () => {
    test('karma: opponent draws, owner draws and tucks age 7 first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
        },
        micah: {
          red: ['John Ericsson'],
          purple: ['Monotheism'],
        },
        decks: {
          base: {
            1: ['Tools'], // Card micah would draw normally
          }
        },
        decksExact: {
          base: {
            7: ['Lighting'], // Age 7 card to draw and tuck by karma
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn (first action)
      request = t.choose(game, request, 'Draw.draw a card')

      t.testBoard(game, {
        dennis: {
          hand: ['Tools'],
        },
        micah: {
          red: ['John Ericsson'],
          purple: ['Monotheism', 'Lighting'],
        },
      })
    })

    test('karma: does not trigger on owner draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson'],
        },
        decks: {
          base: {
            7: ['Lighting'], // Age 7 card - should NOT be drawn (karma doesn't trigger)
          }
        },
      })

      let request
      request = game.run()
      // Skip dennis's turn (first action)
      request = t.choose(game, request, 'Draw.draw a card')

      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson'],
          hand: ['Lighting'],
        },
      })
    })
  })
})
