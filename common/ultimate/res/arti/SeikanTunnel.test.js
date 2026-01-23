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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', 'Seikan Tunnel')
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Construction'],
        museum: ['Museum 1', 'Seikan Tunnel'],
      },
      micah: {
        green: ['Sailing', 'Navigation'],
      },
    })
  })
})
