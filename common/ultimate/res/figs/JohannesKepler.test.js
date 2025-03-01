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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Johannes Kepler')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Satellites')
    request = t.choose(game, request, 'auto')  // Return all cards in hand
    request = t.choose(game, request, 'Email')  // Meld Email
    request = t.choose(game, request)  // Agriculture (don't return a card)

    t.testIsSecondPlayer(game)
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
