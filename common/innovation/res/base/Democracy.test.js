Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Democracy', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Democracy'],
        hand: ['The Wheel'],
      },
      micah: {
        blue: ['Tools'],
        hand: ['Coal'],
      },
      decks: {
        base: {
          6: ['Canning'],
          8: ['Flight'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Democracy')
    const request3 = t.choose(game, request2, 'Coal')
    const request4 = t.choose(game, request3, 'The Wheel')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Democracy'],
        hand: ['Canning'],
      },
      micah: {
        blue: ['Tools'],
        score: ['Flight'],
      }
    })
  })

  test('endorsed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Edinburgh'],
        purple: ['Democracy'],
        hand: ['The Wheel', 'Masonry', 'Sailing'],
      },
      micah: {
        blue: ['Tools'],
        purple: ['Vienna'],
        hand: ['Coal'],
      },
      decks: {
        base: {
          6: ['Canning'],
          8: ['Flight', 'Mobility', 'Rocketry'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Endorse.purple')
    const request3 = t.choose(game, request2, 'Sailing')
    const request4 = t.choose(game, request3, 'Coal')
    const request5 = t.choose(game, request4, 'The Wheel', 'Masonry')
    const request6 = t.choose(game, request5, 'auto')

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        blue: ['Edinburgh'],
        purple: ['Democracy'],
        green: ['Sailing'],
        hand: ['Canning'],
        score: ['Mobility', 'Rocketry'],
      },
      micah: {
        blue: ['Tools'],
        purple: ['Vienna'],
        score: ['Flight'],
      }
    })
  })

})
