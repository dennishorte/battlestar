Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cyrus Cylinder', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cyrus Cylinder'],
        purple: ['Enterprise', 'Monotheism'],
      },
      micah: {
        purple: ['Code of Laws'],
        blue: {
          cards: ['Pottery', 'Tools'],
          splay: 'right',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'micah-blue')

    t.testChoices(request, ['Enterprise', 'Code of Laws'])

    request = t.choose(game, request, 'Code of Laws')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise', 'Monotheism'],
        museum: ['Museum 1', 'Cyrus Cylinder'],
      },
      micah: {
        purple: ['Code of Laws'],
        blue: {
          cards: ['Pottery', 'Tools'],
          splay: 'left',
        },
      },
    })
  })
})
