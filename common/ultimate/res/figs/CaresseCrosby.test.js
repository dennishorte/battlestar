Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Caresse Crosby', () => {

  describe('If a player would dogma a card of a color you do not have splayed left, first splay that color on any board left and draw two {2}. If you splay a fifth color left on your board this way, you win.', () => {
    test('karma: dogma card of color not splayed left, splay left and draw two age 2', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        dennis: {
          yellow: ['Caresse Crosby'],
          blue: ['Writing', 'Tools'], // Blue not splayed left
        },
        decks: {
          base: {
            2: ['Construction', 'Calendar', 'Mathematics'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Caresse Crosby'],
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'left', // Blue splayed left
          },
          hand: ['Construction', 'Calendar', 'Mathematics'],
        },
      })
    })

    test('karma: dogma card of color already splayed left, no karma trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Caresse Crosby'],
          blue: {
            cards: ['Writing', 'Mathematics'],
            splay: 'left', // Blue already splayed left (needs 2+ cards to splay)
          },
        },
        decks: {
          base: {
            2: ['Fermenting'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Writing') // dennis dogmas Mathematics (blue)
      // Karma does NOT trigger: dennis already has blue splayed left

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Caresse Crosby'],
          blue: {
            cards: ['Writing', 'Mathematics'],
            splay: 'left', // Still splayed left, no change
          },
          hand: ['Fermenting'],
        },
      })
    })

    test('karma: splay fifth color left on owner board, win', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'left',
          },
          yellow: {
            cards: ['Caresse Crosby', 'Fermenting'],
            splay: 'left',
          },
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'left',
          },
          purple: {
            cards: ['Code of Laws', 'Mysticism'],
            splay: 'left',
          },
          green: ['Navigation', 'Sailing', 'The Wheel'], // Green not splayed left (fourth color, needs 2+ cards)
        },
        decks: {
          base: {
            2: ['Calendar', 'Mathematics'], // Age 2 cards to draw
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Navigation')
      // Karma triggers: dennis doesn't have green splayed left
      // Only dennis can be chosen (only player with green cards), so auto-selected
      // This is the fifth color splayed left on dennis's board, so dennis wins

      t.testGameOver(request, 'dennis', 'Caresse Crosby')
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'left',
          },
          yellow: {
            cards: ['Caresse Crosby', 'Fermenting'],
            splay: 'left',
          },
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'left',
          },
          purple: {
            cards: ['Code of Laws', 'Mysticism'],
            splay: 'left',
          },
          green: {
            cards: ['Navigation', 'Sailing', 'The Wheel'],
            splay: 'left', // Fifth color splayed left
          },
          hand: ['Calendar', 'Mathematics'], // Two age 2 cards drawn
        },
      })
    })

    test('karma: splay on opponent board, no win even if owner has four colors left', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        dennis: {
          green: ['The Wheel', 'Navigation'], // Micah has green cards (needs 2+ to splay)
        },
        micah: {
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'left',
          },
          yellow: {
            cards: ['Caresse Crosby', 'Fermenting'],
            splay: 'left',
          },
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'left',
          },
          purple: {
            cards: ['Societies', 'Monotheism'],
            splay: 'left',
          },
          green: ['Sailing', 'Paper'],
        },
        decks: {
          base: {
            1: ['Oars', 'Clothing', 'Mysticism', 'Code of Laws'],
            2: ['Canal Building', 'Mapmaking'],
          },
          figs: {
            1: ['Sargon of Akkad'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      request = t.choose(game, request, 'dennis')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: {
            cards: ['The Wheel', 'Navigation'],
            splay: 'left',
          },
          hand: ['Mysticism', 'Code of Laws', 'Sargon of Akkad'],
        },
        micah: {
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'left',
          },
          yellow: {
            cards: ['Caresse Crosby', 'Fermenting'],
            splay: 'left',
          },
          blue: {
            cards: ['Writing', 'Tools'],
            splay: 'left',
          },
          purple: {
            cards: ['Societies', 'Monotheism'],
            splay: 'left',
          },
          green: ['Sailing', 'Paper'],
          hand: ['Oars', 'Clothing', 'Canal Building', 'Mapmaking'],
        },
      })
    })

  })

})
