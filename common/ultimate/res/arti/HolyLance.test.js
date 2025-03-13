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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')


    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Holy Grail'],
        score: ['Industrialization'],
      },
    })
  })

  /* test('dogma: you win', () => {
   *   const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
   *   t.setBoard(game,  {
   *     dennis: {
   *       artifact: ['Holy Lance'],
   *       yellow: ['Holy Grail'],
   *     },
   *   })

   *   let request
    request = game.run()
   *   request = t.choose(game, request, 'dogma')

   *   t.testGameOver(request, 'dennis', 'Holy Lance')
   * }) */
})
