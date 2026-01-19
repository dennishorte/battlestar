Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('J.P. Morgan', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('J.P. Morgan', 'Trade')
  })

  describe('If a player would dogma a card, first splay the color of the card up on your board.', () => {
    test('karma: dogma card, splay color up on owner board', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        dennis: {
          green: ['J.P. Morgan'],
          blue: ['Writing', 'Tools'], // Blue cards to splay up
        },
        micah: {
          blue: ['Mathematics'], // Micah will dogma Mathematics (blue)
          hand: [], // Empty hand so no card to return
        },
        decks: {
          base: {
            8: ['Flight'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card') // dennis draws (first action)
      // Now micah's turn
      request = t.choose(game, request, 'Dogma.Mathematics') // Micah dogmas Mathematics (blue)
      // Karma triggers: splay blue up on dennis's board
      // Mathematics dogma effect: no card in hand to return, so nothing happens

      t.testBoard(game, {
        dennis: {
          green: ['J.P. Morgan'],
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'up', // Blue splayed up
          },
          hand: ['Flight'], // Card drawn by dennis
        },
        micah: {
          blue: ['Mathematics'],
        },
      })
    })

    test('karma: owner dogmas own card, splay color up on owner board', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['J.P. Morgan'],
          blue: ['Writing', 'Tools'], // Blue cards to splay up
        },
        decks: {
          base: {
            2: ['Mapmaking'], // Age 2 card for Writing's dogma effect
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing') // dennis dogmas Writing (blue)
      // Karma triggers: splay blue up on dennis's board
      // Writing dogma effect: draw age 2

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['J.P. Morgan'],
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'up', // Blue splayed up
          },
          hand: ['Mapmaking'], // Age 2 card drawn from Writing's dogma
        },
      })
    })
  })

})
