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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Democracy')
    request = t.choose(game, 'Coal')
    request = t.choose(game, 'The Wheel')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Endorse.purple')
    request = t.choose(game, 'Sailing')
    request = t.choose(game, 'Coal')
    request = t.choose(game, 'The Wheel', 'Masonry')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Edinburgh'],
        purple: ['Democracy'],
        hand: ['Canning'],
        score: ['Mobility', 'Rocketry'],
      },
      micah: {
        blue: ['Tools'],
        purple: ['Vienna'],
        score: ['Flight'],
      },
      junk: ['Sailing'],
    })
  })

})
