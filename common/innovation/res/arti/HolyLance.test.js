Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Holy Lance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holy Lance'],
      },
      micah: {
        red: ['Holmegaard Bows'],
        yellow: ['Fermenting'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Holmegaard Bows'],
      },
      micah: {
        yellow: ['Fermenting'],
      }
    })
  })

  test('dogma: draw and score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holy Lance'],
        yellow: ['Holy Grail'],
      },
      decks: {
        base: {
          6: ['Industrialization'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')


    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Holy Grail'],
        score: ['Industrialization'],
      },
    })
  })
})
