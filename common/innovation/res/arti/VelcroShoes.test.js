Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Velcro Shoes", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
        hand: ['Computers'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Computers'],
      },
      micah: {
        red: ['Coal'],
      },
    })
  })

  test('dogma: no hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
        score: ['Computers'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Computers'],
      },
      micah: {
        red: ['Coal'],
      },
    })
  })

  test('dogma: I win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Velcro Shoes"],
      },
      micah: {
        red: ['Coal'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Velcro Shoes')
  })
})
