Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Oars', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Oars'],
      },
      micah: {
        hand: ['Sailing', 'Writing', 'Metalworking'],
      },
      decks: {
        base: {
          1: ['Clothing', 'The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Oars')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        score: ['Sailing', 'Clothing'],
      },
      micah: {
        hand: ['Writing', 'Metalworking', 'The Wheel'],
      },
    })
  })

  test('dogma (nothing transferred)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Oars'],
      },
      micah: {
        hand: ['Metalworking'],
      },
      decks: {
        base: {
          1: ['Clothing']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Oars')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        hand: ['Clothing'],
      },
      micah: {
        hand: ['Metalworking'],
      },
    })
  })
})
