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
          1: ['Clothing', 'Pottery', 'The Wheel']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Oars')
    request = t.choose(game, 'Sailing')
    request = t.choose(game, 'Writing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        score: ['Sailing', 'Writing', 'Clothing'],
      },
      micah: {
        hand: ['Metalworking', 'Pottery', 'The Wheel'],
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Oars')

    t.testIsSecondPlayer(game)
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
