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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Gunpowder')

    t.testIsFirstAction(request)
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
