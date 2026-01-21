Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Robert E. Lee', () => {

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Robert E. Lee'],
        blue: {
          cards: ['Pottery', 'Calendar'],
          splay: 'up'
        },
        green: ['Clothing'],
        yellow: {
          cards: ['Agriculture', 'Fermenting', 'Antibiotics', 'Canal Building', 'Vaccination'],
          splay: 'up'
        }
      },
    })

    let request
    request = game.run()

    const achs = t.dennis(game).achievementCount()
    expect(achs.other.length).toBe(2)
  })

  describe('If a player would dogma a card with a demand effect, first transfer a top card of another color with {l} from anywhere to any player\'s board.', () => {
    test('karma: dogma with demand effect, transfer card with {l} to opponent', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'], // Card with demand effect
        },
        micah: {
          red: ['Robert E. Lee'],
          yellow: ['Agriculture'],
        },
        achievements: ['Tools'],
        decks: {
          base: {
            1: ['Sailing'], // Card drawn by Archery's demand effect
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma triggers: transfer a top card with {l} of another color

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Archery'],
          yellow: ['Agriculture'], // Agriculture transferred to dennis's yellow pile
          hand: ['Sailing'], // Drew Sailing
        },
        micah: {
          red: ['Robert E. Lee'],
        },
        junk: ['Tools'],
      })
    })

    test('karma: dogma with demand effect, transfer card with {l} to self', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'], // Card with demand effect
          yellow: [], // Empty yellow pile to receive transferred card
        },
        micah: {
          red: ['Robert E. Lee'],
          yellow: ['Agriculture'], // Card with {l} biscuit, different color from Archery (red)
        },
        achievements: ['Tools'],
        decks: {
          base: {
            1: ['Sailing'], // Card drawn by Archery's demand effect
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma triggers: transfer a top card with {l} of another color

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Archery'],
          yellow: ['Agriculture'], // Agriculture transferred to dennis's yellow pile
          hand: ['Sailing'], // Drew Sailing
        },
        micah: {
          red: ['Robert E. Lee'],
        },
        junk: ['Tools'],
      })
    })

    test('karma: does not trigger on dogma without demand effect', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Agriculture'], // Card without demand effect, has {l}
        },
        micah: {
          red: ['Robert E. Lee'],
          blue: ['Pottery'], // Card with {l} biscuit
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      // Karma should NOT trigger (Agriculture has no demand effect)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Agriculture'],
        },
        micah: {
          red: ['Robert E. Lee'],
          blue: ['Pottery'], // Pottery remains (karma did not trigger)
        },
      })
    })

    test('karma: multiple cards available, choose which to transfer', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'], // Card with demand effect
          yellow: [], // Empty yellow pile
        },
        micah: {
          red: ['Robert E. Lee'],
          yellow: ['Agriculture'], // Yellow card with {l}
          blue: ['Pottery'], // Blue card with {l}
        },
        decks: {
          base: {
            1: ['Sailing'], // Card drawn by Archery's demand effect
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')
      // Karma triggers: transfer a top card with {l} of another color
      // Available: Agriculture (yellow), Pottery (blue)
      request = t.choose(game, request, 'Pottery') // Choose Pottery (blue, has {l})

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Archery'],
          blue: ['Pottery'], // Pottery transferred to dennis's blue pile
          hand: ['Sailing'], // Drew Sailing
        },
        micah: {
          red: ['Robert E. Lee'],
          yellow: ['Agriculture'], // Agriculture remains (not chosen)
        },
      })
    })
  })
})
