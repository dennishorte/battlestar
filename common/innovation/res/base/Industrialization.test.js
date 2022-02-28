Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mikhail Kalashnikov', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Industrialization'],
        yellow: ['Canning'],
      },
      decks: {
        base: {
          6: ['Machine Tools', 'Atomic Theory'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Industrialization')
    const request3 = t.choose(game, request2, 'red')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Industrialization', 'Machine Tools'],
          splay: 'right'
        },
        yellow: ['Canning'],
        blue: ['Atomic Theory']
      },
    })
  })

})
