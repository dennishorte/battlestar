Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Carl Friedrich Gauss', () => {

  describe('If you would meld a card, first choose a value and meld all other cards of that value from your hand and score pile.', () => {
    test('karma: choose different age, meld cards from hand and score', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          score: ['The Wheel', 'Construction'],
          hand: ['Quantum Theory', 'Sailing', 'Enterprise'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Quantum Theory')
      request = t.choose(game, request, 1)
      request = t.choose(game, request, 'Sailing')

      t.testBoard(game, {
        dennis: {
          green: ['The Wheel', 'Sailing'],
          blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
          score: ['Construction'],
          hand: ['Enterprise'],
        },
      })
    })

    test('karma: choose same age as card being melded, no other cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          score: ['The Wheel', 'Construction'],
          hand: ['Quantum Theory', 'Sailing', 'Enterprise'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Quantum Theory')
      request = t.choose(game, request, 8)

      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
          score: ['The Wheel', 'Construction'],
          hand: ['Sailing', 'Enterprise'],
        },
      })
    })

    test('karma: choose age with cards only in hand', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          score: ['Construction'], // Age 2, not age 1
          hand: ['Quantum Theory', 'Sailing', 'Enterprise'], // Sailing is age 1
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Quantum Theory')
      request = t.choose(game, request, 1)
      // Should meld Sailing (age 1) from hand only

      t.testBoard(game, {
        dennis: {
          green: ['Sailing'],
          blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
          score: ['Construction'],
          hand: ['Enterprise'],
        },
      })
    })

    test('karma: choose age with cards only in score', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          score: ['The Wheel', 'Construction'], // Both age 1 and age 2
          hand: ['Quantum Theory', 'Enterprise'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Quantum Theory')
      request = t.choose(game, request, 1)
      // Should meld The Wheel (age 1) from score

      t.testBoard(game, {
        dennis: {
          green: ['The Wheel'],
          blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
          score: ['Construction'],
          hand: ['Enterprise'],
        },
      })
    })

    test('karma: choose age with no other cards, logs no effect', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          score: ['The Wheel'],
          hand: ['Quantum Theory', 'Enterprise'], // No age 3 cards
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Quantum Theory')
      request = t.choose(game, request, 3)
      // No other age 3 cards, should log "no effect" but still meld Quantum Theory

      t.testBoard(game, {
        dennis: {
          blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
          score: ['The Wheel'],
          hand: ['Enterprise'],
        },
      })
    })
  })

  describe('If you would take a Draw action, first draw a {7}.', () => {
    test('karma: draw action, draw age 7 first, then normal draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'], // Age 6, so normal draw would draw age 6
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card (normal draw would get this)
            7: ['Lighting'], // Age 7 card (karma will draw this first)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers: draw age 7 first (Lighting)
      // Then normal draw: draw age 6 (Industrialization)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          hand: ['Lighting', 'Industrialization'], // Age 7 drawn first, then age 6
        },
      })
    })

    test('karma: does not trigger on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          green: ['The Wheel'], // The Wheel's dogma draws cards
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Cards drawn by The Wheel's dogma
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      // The Wheel's dogma draws two age 1 cards, but Carl Friedrich Gauss's karma should not trigger
      // (only triggers on Draw action, not on draws from dogma effects)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Carl Friedrich Gauss'],
          green: ['The Wheel'],
          hand: ['Tools', 'Sailing'], // Drew normally from dogma (karma did not trigger)
        },
      })
    })
  })
})
