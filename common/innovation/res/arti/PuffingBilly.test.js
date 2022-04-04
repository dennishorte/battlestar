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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
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
