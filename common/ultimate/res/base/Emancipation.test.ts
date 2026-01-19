Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Emancipation')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'purple')

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
