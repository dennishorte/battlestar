Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Cryptocurrency', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
        red: ['Coal', 'Metalworking'],
        score: ['Tools', 'Optics'],
      },
      decks: {
        base: {
          10: ['Software'],
        },
        usee: {
          10: ['Ride-Hailing'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cryptocurrency')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
        red: {
          cards: ['Coal', 'Metalworking'],
          splay: 'up',
        },
        score: ['Software', 'Ride-Hailing'],
      },
    })
  })

})
