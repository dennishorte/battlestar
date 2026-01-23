Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Benjamin Franklin', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Benjamin Franklin', 'Advancement')
  })

  describe('If you would meld a card, first if there is a top figure of the same color on any opponent\'s board, transfer that figure to your hand.', () => {
    test('karma: opponent has matching color figure, transfer it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Benjamin Franklin'],
          hand: ['Quantum Theory'], // Blue card to meld
        },
        micah: {
          blue: ['Carl Friedrich Gauss'], // Blue figure on opponent's board
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Quantum Theory')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Benjamin Franklin'], // Quantum Theory melded (goes to front)
          hand: ['Carl Friedrich Gauss'], // Figure transferred to hand
        },
        micah: {
          blue: [], // Figure was transferred away
        },
      })
    })

    test('karma: opponent has figure but different color, no transfer', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Benjamin Franklin'],
          hand: ['Quantum Theory'], // Blue card to meld
        },
        micah: {
          green: ['John Harrison'], // Green figure (different color)
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Quantum Theory')
      // No transfer option available (figure is different color)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Benjamin Franklin'],
          hand: [],
        },
        micah: {
          green: ['John Harrison'], // Figure remains (different color)
        },
      })
    })

    test('karma: opponent has non-figure card of same color, no transfer', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Benjamin Franklin'],
          hand: ['Quantum Theory'], // Blue card to meld
        },
        micah: {
          blue: ['Mathematics'], // Blue card but not a figure
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Quantum Theory')
      // No transfer option available (card is not a figure)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Benjamin Franklin'],
          hand: [],
        },
        micah: {
          blue: ['Mathematics'], // Card remains (not a figure)
        },
      })
    })

    test('karma: no matching figures, no transfer', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Benjamin Franklin'],
          hand: ['Quantum Theory'], // Blue card to meld
        },
        micah: {
          red: ['Archery'], // Different color, not a figure anyway
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Meld.Quantum Theory')
      // No transfer option available (no matching figures)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Benjamin Franklin'],
          hand: [],
        },
        micah: {
          red: ['Archery'],
        },
      })
    })

  })
})
