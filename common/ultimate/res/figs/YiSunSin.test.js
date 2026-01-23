Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Yi Sun-Sin', () => {

  describe('If any player would transfer a card or exchange any number of cards, instead tuck that card or those cards, draw and tuck a {4}, and score a top card with a {k} from anywhere.', () => {

    describe('transfer action', () => {
      test('karma: owner transfers card, tucks it, draws and tucks {4}, scores top card with {k}', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        t.setBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin'],
            green: ['Mapmaking'],
          },
          micah: {
            yellow: ['Masonry'],
            score: ['Metalworking'],
          },
          decks: {
            base: {
              4: ['Gunpowder'],
            }
          }
        })

        let request
        request = game.run()
        request = t.choose(game, 'Dogma.Mapmaking')
        request = t.choose(game, 'Masonry')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin', 'Metalworking', 'Gunpowder'],
            green: ['Mapmaking'],
            score: ['Masonry'],
          },
        })
      })

      test('karma: opponent transfers card, owner tucks it, draws and tucks {4}, scores top card with {k}', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        t.setBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin'],
            score: ['Metalworking']
          },
          micah: {
            green: ['Mapmaking'],
          },
          decks: {
            base: {
              4: ['Printing Press', 'Gunpowder'],
            }
          }
        })

        let request
        request = game.run()
        // Skip dennis's turn by drawing a card (first round only has one action)
        request = t.choose(game, 'Draw.draw a card')
        // Now micah's turn starts
        request = t.choose(game, 'Dogma.Mapmaking')

        t.testBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin', 'Metalworking', 'Gunpowder'],
            hand: ['Printing Press'],
            score: ['Mapmaking'], // Mapmaking has {k} biscuit, so it gets scored
          },
          micah: {
          },
        })
      })
    })

    describe('exchange action', () => {
      test('karma: owner exchanges cards, tucks them, draws and tucks {4}, scores top card with {k}', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        t.setBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin'],
            yellow: ['Canal Building'],
            hand: ['Metalworking'], // Age 1
            score: ['The Wheel'], // Age 1
          },
          micah: {
            yellow: ['Masonry'], // Has {k} biscuit
          },
          decks: {
            base: {
              4: ['Gunpowder'],
            }
          }
        })

        let request
        request = game.run()
        request = t.choose(game, 'Dogma.Canal Building')
        request = t.choose(game, 'Exchange highest cards between hand and score pile')
        // TuckMany asks to choose which cards to tuck (or use 'auto' to tuck all)
        request = t.choose(game, 'auto')
        // Choose which top card with {k} to score (Masonry on micah's board)
        request = t.choose(game, 'Masonry')

        t.testBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin', 'Metalworking', 'Gunpowder'],
            yellow: ['Canal Building'],
            green: ['The Wheel'],
            score: ['Masonry'],
          },
          micah: {
          },
        })
      })

      test('karma: opponent exchanges cards, owner tucks them, draws and tucks {4}, scores top card with {k}', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        t.setBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin'],
            yellow: ['Masonry'], // Has {k} biscuit
          },
          micah: {
            yellow: ['Canal Building'],
            hand: ['Metalworking'], // Age 1
            score: ['The Wheel'], // Age 1
          },
          decks: {
            base: {
              4: ['Printing Press', 'Gunpowder'],
            }
          }
        })

        let request
        request = game.run()
        // Skip dennis's turn by drawing a card (first round only has one action)
        request = t.choose(game, 'Draw.draw a card')
        // Now micah's turn starts
        request = t.choose(game, 'Dogma.Canal Building')
        request = t.choose(game, 'Exchange highest cards between hand and score pile')
        // TuckMany asks to choose which cards to tuck (or use 'auto' to tuck all)
        request = t.choose(game, 'auto')
        // Choose which top card with {k} to score (Masonry on dennis's board)
        request = t.choose(game, 'Masonry')

        t.testBoard(game, {
          dennis: {
            red: ['Yi Sun-Sin', 'Metalworking', 'Gunpowder'],
            green: ['The Wheel'],
            hand: ['Printing Press'],
            score: ['Masonry'],
          },
          micah: {
            yellow: ['Canal Building'],
          },
        })
      })
    })
  })

})
