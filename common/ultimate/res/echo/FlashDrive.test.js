Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Flash Drive", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Flash Drive', 'Navigation'],
        score: ['Canning'],
      },
      micah: {
        score: ['Tools', 'Fermenting', 'Engineering', 'Sailing', 'Mysticism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flash Drive')
    request = t.choose(game, request, 'Tools', 'Fermenting', 'Engineering', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Flash Drive', 'Navigation'],
          splay: 'up'
        },
      },
      micah: {
        score: ['Mysticism'],
      },
    })
  })
})
