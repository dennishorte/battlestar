Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('John Harrison', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('John Harrison', 'Trade')
  })

  describe('If you would take a Draw action, first return a card from your hand. If you do, draw a card from any set of value equal to the returned card.', () => {
    test('karma: return card and draw from same age, different expansion', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['John Harrison'], // Age 6, so normal draw would draw age 6
          hand: ['Tools'], // Age 1 card
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card (normal draw would get this)
          },
          figs: {
            1: ['Homer'], // Age 1 figure card (karma will draw from figs instead)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'figs')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['John Harrison'],
          hand: ['Homer', 'Industrialization'], // Homer drawn by karma from figs, Industrialization drawn normally from base
          // Tools was returned
        },
      })
    })

    test('karma: no cards in hand, draw normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['John Harrison'], // Age 6, so normal draw would draw age 6
          hand: [], // No cards in hand
        },
        decks: {
          base: {
            6: ['Industrialization'], // Age 6 card to draw normally
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // Karma triggers but no cards to return, so draw normally

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['John Harrison'],
          hand: ['Industrialization'], // Industrialization drawn normally (age 6)
        },
      })
    })

    test('karma: does not trigger on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['The Wheel', 'John Harrison'], // The Wheel must be top card to dogma it
          hand: ['Tools'], // Age 1 card
        },
        decks: {
          base: {
            1: ['Sailing', 'Domestication'], // Cards drawn by The Wheel's dogma
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      // The Wheel's dogma draws two age 1 cards, but John Harrison's karma should not trigger
      // (only triggers on Draw action, not on draws from dogma effects)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['The Wheel', 'John Harrison'],
          hand: ['Tools', 'Sailing', 'Domestication'], // Drew normally from dogma (karma did not trigger)
        },
      })
    })
  })
})
