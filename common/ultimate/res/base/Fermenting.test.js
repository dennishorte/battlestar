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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fermenting')

    t.testIsSecondPlayer(game)
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
