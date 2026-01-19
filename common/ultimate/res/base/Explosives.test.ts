Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Explosives')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Explosives')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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
