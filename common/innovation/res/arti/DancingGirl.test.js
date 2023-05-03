Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dancing Girl', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Dancing Girl'],
      },
      micah: {
        purple: ['Philosophy', 'Code of Laws'],
        red: ['Construction'],
        yellow: ['Canal Building'],
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dancing Girl')
    const request3 = t.choose(game, request2, 'Construction')

    t.dumpLog(game)

//    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        purple: ['Code of Laws'],
        yellow: ['Dancing Girl', 'Canal Building'],
        green: ['Sailing'],
      },
    })
  })


  /* test('dogma', () => {
   *   const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
   *   t.setBoard(game,  {
   *     dennis: {
   *       yellow: ['Dancing Girl'],
   *     },
   *     micah: {
   *       purple: ['Philosophy'],
   *     },
   *   })

   *   const request1 = game.run()
   *   const request2 = t.choose(game, request1, 'Dogma.Dancing Girl')

   *   t.testGameOver(request2, 'dennis', 'Dancing Girl')
   * })

   * test('dogma: free artifact action does not win', () => {
   *   const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
   *   t.setBoard(game,  {
   *     dennis: {
   *       artifact: ['Dancing Girl'],
   *     },
   *     micah: {
   *       purple: ['Philosophy'],
   *     },
   *   })

   *   const request1 = game.run()
   *   const request2 = t.choose(game, request1, 'dogma')

   *   t.testIsFirstAction(request2)
   *   t.testBoard(game, {
   *     micah: {
   *       yellow: ['Dancing Girl'],
   *       purple: ['Philosophy'],
   *     },
   *   })
   * }) */
})
