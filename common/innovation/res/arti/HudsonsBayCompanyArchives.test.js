Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Hudson's Bay Company Archives", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Hudson's Bay Company Archives"],
        red: ['Construction', 'Archery'],
        blue: ['Mathematics', 'Tools'],
        green: ['Navigation', 'The Wheel'],
        score: ['Gunpowder'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'Gunpowder')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Gunpowder', 'Construction'],
          splay: 'right'
        },
        blue: ['Mathematics'],
        green: ['Navigation'],
        score: ['Archery', 'Tools', 'The Wheel'],
      }
    })
  })
})
