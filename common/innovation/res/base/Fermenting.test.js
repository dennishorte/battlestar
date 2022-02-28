Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fermenting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        blue: {
          cards: ['Tools', 'Pottery'],
          splay: 'left'
        },
        green: ['The Wheel'],
      },
      decks: {
        base: {
          2: ['Calendar', 'Construction'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fermenting')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        blue: {
          cards: ['Tools', 'Pottery'],
          splay: 'left'
        },
        green: ['The Wheel'],
        hand: ['Calendar', 'Construction'],
      },
    })
  })

})
