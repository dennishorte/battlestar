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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Flash Drive')
    const request3 = t.choose(game, request2, 'Tools', 'Fermenting', 'Engineering', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'green')

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
