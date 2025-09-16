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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Velcro Shoes')
  })
})
