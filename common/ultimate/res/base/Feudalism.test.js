Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Feudalism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Feudalism', 'Code of Laws'],
      },
      micah: {
        green: {
          cards: ['Navigation', 'Mapmaking'],
          splay: 'left'
        },
        hand: ['The Wheel', 'Tools', 'Agriculture']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Feudalism')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Feudalism', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      micah: {
        green: ['Navigation', 'Mapmaking'],
        hand: ['Tools', 'Agriculture'],
      }
    })
  })

})
