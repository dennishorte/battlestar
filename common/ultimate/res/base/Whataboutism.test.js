Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Whataboutism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Whataboutism'],
        score: ['The Wheel'],
      },
      micah: {
        red: ['Archery', 'Oars'],
        purple: ['Code of Laws', 'Monotheism'],
        score: ['Fermenting'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Whataboutism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Whataboutism'],
        score: ['Fermenting'],
      },
      micah: {
        red: ['Oars'],
        purple: ['Code of Laws', 'Monotheism'],
        score: ['The Wheel'],
      },
    })
  })
})
