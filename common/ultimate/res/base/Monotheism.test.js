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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Monotheism')
    const request3 = t.choose(game, request2, 'Tools')

    t.testIsSecondPlayer(request3)
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
