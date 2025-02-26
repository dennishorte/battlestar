Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Explosives', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Explosives'],
      },
      micah: {
        hand: ['The Wheel']
      },
      decks: {
        base: {
          7: ['Bicycle'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Explosives')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Explosives'],
        hand: ['The Wheel'],
      },
      micah: {
        hand: ['Bicycle'],
      }
    })
  })

  test('dogma (test 2)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Explosives'],
      },
      micah: {
        hand: ['The Wheel', 'Tools', 'Canning', 'Bicycle'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Explosives')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Explosives'],
        hand: ['The Wheel', 'Bicycle', 'Canning'],
      },
      micah: {
        hand: ['Tools'],
      }
    })
  })

})
