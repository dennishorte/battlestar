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
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Gunpowder')

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
        museum: ['Museum 1', "Hudson's Bay Company Archives"],
      }
    })
    t.testDeckIsJunked(game, 4)
  })
})
