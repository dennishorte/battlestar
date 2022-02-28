Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Machinery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        red: ['Archery', 'Oars'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering'],
      },
      micah: {
        hand: ['Sailing', 'Calendar', 'Paper'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Machinery')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'red')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        red: {
          cards: ['Archery', 'Oars'],
          splay: 'left'
        },
        hand: ['Tools', 'Fermenting', 'Sailing', 'Calendar', 'Paper'],
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Engineering'],
      },
    })
  })
})
