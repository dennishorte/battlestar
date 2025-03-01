Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Monotheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Monotheism'],
        yellow: ['Canning'],
        green: ['The Wheel'],
      },
      micah: {
        purple: ['Services'],
        yellow: ['Stem Cells'],
        red: ['Archery'],
        blue: ['Tools'],
      },
      decks: {
        base: {
          1: ['Code of Laws', 'Mysticism']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Monotheism')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Monotheism', 'Mysticism'],
        yellow: ['Canning'],
        green: ['The Wheel'],
        score: ['Tools'],
      },
      micah: {
        purple: ['Services', 'Code of Laws'],
        yellow: ['Stem Cells'],
        red: ['Archery'],
      },
    })
  })
})
