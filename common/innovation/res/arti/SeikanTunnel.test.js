Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Seikan Tunnel", () => {

  test('dogma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Seikan Tunnel"],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left',
        },
      },
      micah: {
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Seikan Tunnel')
  })

  test('dogma: unsplayed counts as 1', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Seikan Tunnel"],
        red: ['Archery', 'Construction'],
      },
      micah: {
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
  })

  test('dogma: tied', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Seikan Tunnel"],
        red: ['Archery', 'Construction'],
      },
      micah: {
        green: ['Sailing', 'Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Construction'],
      },
      micah: {
        green: ['Sailing', 'Navigation'],
      },
    })
  })
})
