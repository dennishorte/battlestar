Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Feudalism')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'purple')

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
