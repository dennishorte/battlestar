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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['Enterprise', 'Code of Laws'])

    const request3 = t.choose(game, request2, 'Code of Laws')
    const request4 = t.choose(game, request3, 'micah-blue')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise', 'Monotheism'],
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
