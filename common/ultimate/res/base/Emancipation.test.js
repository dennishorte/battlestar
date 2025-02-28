Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emancipation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Emancipation', 'Code of Laws'],
      },
      micah: {
        hand: ['The Wheel', 'Enterprise'],
      },
      decks: {
        base: {
          6: ['Canning']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Emancipation')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Emancipation', 'Code of Laws'],
          splay: 'right'
        },
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Canning', 'Enterprise'],
      },
    })
  })
})
