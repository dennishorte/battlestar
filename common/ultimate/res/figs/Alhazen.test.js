Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alhazen', () => {

  describe('karma: draw action', () => {
    test('tuck a top card with {k} and draw based on {k} or {s} count', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          red: ['Metalworking'], // Metalworking has {k} biscuits (kkhk) - 3 {k} icons
          // Red zone has 3 {k} icons from Metalworking
        },
        micah: {
          red: ['Saladin'], // Saladin has {k} biscuit (3hpk) - 1 {k} icon
        },
        decks: {
          base: {
            3: ['Engineering'], // Will be drawn (age 3 = number of {k} in red)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // After Draw action, karma should trigger and create a request to choose which card to tuck
      request = t.choose(game, 'Metalworking')
      // Should choose age to draw (3, from red zone's {k} count)
      request = t.choose(game, 3)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          red: ['Metalworking'], // Metalworking was tucked (at end of pile)
          hand: ['Engineering'], // Drew age 3 card
        },
        micah: {
          red: ['Saladin'],
        },
      })
    })

    test('multiple age choices from different colors', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: {
            cards: ['Alhazen', 'Mathematics'],
            splay: 'aslant',
          },
          green: ['The Wheel'], // The Wheel: hsss = 3 {s}
        },
        micah: {
          blue: ['Tools'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      request = t.choose(game, 'Tools')

      t.testBoard(game, {
        dennis: {
          blue: {
            cards: ['Alhazen', 'Mathematics', 'Tools'],
            splay: 'aslant',
          },
          green: ['The Wheel'], // The Wheel: hsss = 3 {s}
        },
      })

      t.testChoices(request, [1, 3, 6])
    })

    test('does not trigger on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          green: ['The Wheel'], // The Wheel's dogma draws cards
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // The Wheel's dogma draws cards, but Alhazen's karma should not trigger
      // (only triggers on Draw action, not on draws from dogma effects)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          green: ['The Wheel'],
          hand: ['Tools', 'Sailing'], // Drew normally from dogma
        },
      })
    })

    test('tuck from own board', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          red: ['Metalworking', 'Archery'], // Metalworking has {k}, Archery doesn't
          // Red zone has 3 {k} icons from Metalworking
        },
        decks: {
          base: {
            2: ['Calendar'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      request = t.choose(game, 2) // Choose an available age

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Alhazen'],
          red: ['Archery', 'Metalworking'], // Metalworking tucked to end
          hand: ['Calendar'], // Card drawn based on chosen age
        },
      })
    })
  })

})
