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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dancing Girl')
    request = t.choose(game, request, 'Construction')

    t.dumpLog(game)

//    t.testIsFirstAction(request)
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

  test('dogma with empty yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Dancing Girl'],
      },
      micah: {
        purple: ['Philosophy', 'Code of Laws'],
        red: ['Construction'],
        green: ['Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dancing Girl')
    request = t.choose(game, request, 'Construction')

    t.dumpLog(game)

//    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        purple: ['Code of Laws'],
        yellow: ['Dancing Girl'],
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

   *   let request
    request = game.run()
   *   request = t.choose(game, request, 'Dogma.Dancing Girl')

   *   t.testGameOver(request, 'dennis', 'Dancing Girl')
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

   *   let request
    request = game.run()
   *   request = t.choose(game, request, 'dogma')

   *   t.testIsFirstAction(request)
   *   t.testBoard(game, {
   *     micah: {
   *       yellow: ['Dancing Girl'],
   *       purple: ['Philosophy'],
   *     },
   *   })
   * }) */
})
