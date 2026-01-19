Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machinery')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
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
