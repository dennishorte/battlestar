Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Puffing Billy", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Puffing Billy"],
        yellow: {
          cards: ['Canning', 'Agriculture', 'Sanitation'],
          splay: 'up'
        },
        hand: ['Fermenting'],
      },
      decks: {
        base: {
          6: ['Industrialization'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Agriculture', 'Sanitation'],
          splay: 'right',
        },
        hand: ['Industrialization'],
      }
    })
  })
})
