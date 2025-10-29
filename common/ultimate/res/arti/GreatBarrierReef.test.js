Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Great Barrier Reef", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Great Barrier Reef"],
        red: ['Industrialization', 'Flight', 'Oars', 'Archery', 'Coal', 'Construction', 'Road Building'],
        green: ['Paper', 'Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Industrialization', 'Flight', 'Oars', 'Archery', 'Coal'],
          splay: 'aslant',
        },
        green: {
          cards: ['Paper', 'Navigation'],
          splay: 'aslant',
        },
        museum: ['Museum 1', "Great Barrier Reef"],
      },
      junk: ['Construction', 'Road Building'],
    })
  })
})
