Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Johannes Kepler', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Johannes Kepler'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Johannes Kepler')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Johannes Kepler'],
        hand: ['Coal']
      },
      decks: {
        base: {
          8: ['Empiricism', 'Antibiotics', 'Corporations']
        }
      }
    })
  })

  test('karma: card ages', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Johannes Kepler'],
        green: ['Satellites'],
        hand: ['Navigation', 'Tools'],
      },
      decks: {
        base: {
          9: ['Specialization', 'Computers'],
        },
        echo: {
          9: ['Email'],
          10: ['Flash Drive']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Satellites')
    const request3 = t.choose(game, request2, 'auto')  // Return all cards in hand
    const request4 = t.choose(game, request3, 'Email')  // Meld Email
    const request5 = t.choose(game, request4)  // Agriculture (don't return a card)

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['Johannes Kepler'],
        yellow: ['Agriculture'],
        green: ['Email', 'Satellites'],
        hand: ['Specialization', 'Computers'],
        forecast: ['Flash Drive'],
      },
    })
  })
})
