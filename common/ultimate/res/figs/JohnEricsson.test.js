Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Ericsson', () => {

  describe('If you would dogma a card of a color an opponent has splayed right, first unsplay that color on an opponent\'s board.', () => {
    test('karma: dogma card, opponent has same color splayed right, unsplay it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'], // Card to dogma (red)
        },
        micah: {
          red: {
            cards: ['Gunpowder', 'Construction'],
            splay: 'right', // Red splayed right
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma triggers: unsplay red on micah's board

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'],
        },
        micah: {
          red: ['Gunpowder', 'Construction'], // Red unsplayed (splay: 'none')
        },
      })
    })

    test('karma: does not trigger if opponent color not splayed right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'], // Card to dogma (red)
        },
        micah: {
          red: {
            cards: ['Gunpowder', 'Construction'],
            splay: 'left', // Red splayed left, not right
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma should NOT trigger (red is splayed left, not right)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'],
        },
        micah: {
          red: {
            cards: ['Gunpowder', 'Construction'],
            splay: 'left', // Red remains splayed left (karma did not trigger)
          },
        },
      })
    })

    test('karma: multiple opponents with same color splayed right, choose which to unsplay', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'], // Card to dogma (red)
        },
        micah: {
          red: {
            cards: ['Gunpowder', 'Construction'],
            splay: 'right', // Red splayed right
          },
        },
        scott: {
          red: {
            cards: ['Metalworking', 'Road Building'],
            splay: 'right', // Red also splayed right
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma triggers: choose which opponent to unsplay
      request = t.choose(game, request, 'micah') // Choose to unsplay micah's red

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['John Ericsson', 'Archery'],
        },
        micah: {
          red: ['Gunpowder', 'Construction'], // Red unsplayed (splay: 'none')
        },
        scott: {
          red: {
            cards: ['Metalworking', 'Road Building'],
            splay: 'right', // Red remains splayed right (not chosen)
          },
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
