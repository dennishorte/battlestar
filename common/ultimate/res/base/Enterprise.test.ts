Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Enterprise', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        green: ['Mapmaking', 'The Wheel'],
        red: ['Optics'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
        purple: ['City States'],
        red: ['Oars'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Enterprise')
    request = t.choose(game, request, 'Oars')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        green: {
          cards: ['Mapmaking', 'The Wheel'],
          splay: 'right',
        },
        red: ['Oars', 'Optics'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
        purple: ['City States'],
        red: ['Gunpowder'],
      }
    })
  })
})
