Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Taki ad-Din', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Taki ad-Din', 'Advancement')
  })

  describe('If you would take a Draw action, instead draw and reveal a {5}, and splay its color on your board right. If the drawn card has {s}, meld it.', () => {
    test('karma: draw action, draw and reveal {5}, splay color right, card has {s}, meld it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
          purple: ['Reformation', 'Philosophy'], // Two purple cards already on board (need 2+ to splay)
        },
        decks: {
          base: {
            5: ['Societies'], // Age 5, has {s} biscuit (chsc)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
          purple: {
            cards: ['Societies', 'Reformation', 'Philosophy'], // Societies was melded (has {s})
            splay: 'right', // Purple was splayed right
          },
        },
      })
    })

    test('karma: draw action, draw and reveal {5}, splay color right, card does not have {s}', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
          red: ['Archery', 'Construction'], // Two red cards already on board (need 2+ to splay)
        },
        decks: {
          base: {
            5: ['The Pirate Code'], // Age 5, no {s} biscuit (cfch)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'right', // Red was splayed right
          },
          hand: ['The Pirate Code'], // The Pirate Code was drawn and revealed but not melded (no {s})
        },
      })
    })

    test('karma: does not trigger on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
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
      // The Wheel's dogma draws cards, but Taki ad-Din's karma should not trigger
      // (only triggers on Draw action, not on draws from dogma effects)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Taki ad-Din'],
          green: ['The Wheel'],
          hand: ['Tools', 'Sailing'], // Drew normally from dogma
        },
      })
    })
  })

})
