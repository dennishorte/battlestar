Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Tasmanian Tiger", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Industrialization'],
        artifact: ["Tasmanian Tiger"],
        score: ['Tools', 'Coal'],
      },
      micah: {
        red: {
          cards: ['Flight', 'Archery'],
          splay: 'left',
        },
        green: ['Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Coal')
    request = t.choose(game, request, 'Flight')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization'],
        score: ['Flight', 'Tools'],
        museum: ['Museum 1', "Tasmanian Tiger"],
      },
      micah: {
        red: {
          cards: ['Coal', 'Archery'],
          splay: 'left',
        },
        green: ['Paper'],
      },
    })
  })
})
