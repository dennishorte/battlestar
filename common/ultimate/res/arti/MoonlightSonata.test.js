Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Moonlight Sonata", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moonlight Sonata"],
        red: ['Archery'],
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'left'
        }
      },
      achievements: ['Software'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: {
          cards: ['Masonry', 'Canning'],
          splay: 'left'
        },
        achievements: ['Software'],
      },
    })
  })

  test('dogma: single card in stack', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moonlight Sonata"],
        red: ['Archery'],
      },
      achievements: ['Software'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
//        achievements: ['Software'],
      },
    })
  })
})
