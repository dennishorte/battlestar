Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Adam Smith', () => {

  test('karma: calculate-biscuits - Each {c} provides two additional {c}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Adam Smith'],
        blue: ['Writing'],
      },
    })
    let request
    request = game.run()

    expect(t.dennis(game).biscuits().c).toBe(9)
  })

  describe('If you would take a dogma action with no player eligible to share, first junk all cards in the {6} deck. If you don\'t, splay one color of your cards right.', () => {
    test('karma: no sharing, junk age 6 deck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'], // Card to dogma - has {s} biscuit, no sharing possible
        },
        micah: {
          // No cards with {s} biscuit, so no sharing
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card to be drawn by Writing's dogma
            6: ['Industrialization', 'Canning'], // Age 6 cards to be junked
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')
      // Karma triggers: junk age 6 deck first

      t.testIsSecondPlayer(game)
      t.testDeckIsJunked(game, 6) // Age 6 deck was junked
      t.testBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'],
          hand: ['Mathematics'], // Drawn by Writing's dogma
        },
        // Don't check specific junk cards - all age 6 cards are junked
      })
    })

    test('karma: no sharing, age 6 deck empty, splay color right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'], // Card to dogma
          red: ['Archery', 'Metalworking'], // Cards to splay (need 2+ for splay)
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card to be drawn by Writing's dogma
          }
        },
        decksExact: {
          base: {
            6: [], // Age 6 deck is empty
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')
      // Karma triggers: age 6 deck is empty, so splay a color right

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'],
          red: {
            cards: ['Archery', 'Metalworking'],
            splay: 'right',
          },
          hand: ['Mathematics'], // Drawn by Writing's dogma
        },
      })
    })

    test('karma: sharing available, karma does not trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'], // Card to dogma - has {s} biscuit
        },
        micah: {
          blue: ['Tools'], // Has {s} biscuit (hssk), so can share Writing's dogma
        },
        decks: {
          base: {
            2: ['Construction', 'Mathematics'], // Card to be drawn
          },
          figs: {
            6: ['John Loudon McAdam'],
          },
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')
      // Karma does NOT trigger because sharing is possible (micah can share if they have {s})

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Adam Smith'],
          blue: ['Writing'],
          hand: ['Mathematics', 'John Loudon McAdam'],
        },
        micah: {
          blue: ['Tools'],
          hand: ['Construction'],
        },
        junk: [],
      })
    })
  })
})
