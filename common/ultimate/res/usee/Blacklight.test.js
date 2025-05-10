Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Blacklight', () => {

  test('dogma: unsplay blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: {
          cards: ['Blacklight', 'Tools'],
          splay: 'left',
        },
        red: ['Coal', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Blacklight')
    request = t.choose(game, request, 'Unsplay.blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Blacklight', 'Tools'],
        red: ['Coal', 'Metalworking'],
      },
    })
  })

  test('dogma: splay up and draw red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: {
          cards: ['Blacklight', 'Tools'],
          splay: 'left',
        },
        red: ['Coal', 'Metalworking'],
      },
      decks: {
        usee: {
          9: ['Fermi Paradox'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Blacklight')
    request = t.choose(game, request, 'Splay up and draw.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Blacklight', 'Tools'],
          splay: 'left',
        },
        red: {
          cards: ['Coal', 'Metalworking'],
          splay: 'up',
        },
        hand: ['Fermi Paradox'],
      },
    })
  })

})
