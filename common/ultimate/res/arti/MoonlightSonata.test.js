Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Moonlight Sonata", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moonlight Sonata"],
        red: ['Archery'],
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'left'
        }
      },
      achievements: ['Software', 'Coal'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, '**base-10*')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: {
          cards: ['Masonry', 'Canning'],
          splay: 'left'
        },
        achievements: ['Software'],
        museum: ['Museum 1', 'Moonlight Sonata'],
      },
      junk: ['Coal']
    })
  })
})
