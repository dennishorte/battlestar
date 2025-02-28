Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Enterprise')
    const request3 = t.choose(game, request2, 'Oars')
    const request4 = t.choose(game, request3, 'green')

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
