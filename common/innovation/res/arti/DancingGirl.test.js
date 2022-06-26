Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dancing Girl', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Dancing Girl'],
      },
      micah: {
        purple: ['Philosophy'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dancing Girl')

    t.testBoard(game,  {
      dennis: {
        yellow: ['Dancing Girl'],
        red: ['Gunpowder'],
      },
      micah: {
        purple: ['Philosophy'],
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
