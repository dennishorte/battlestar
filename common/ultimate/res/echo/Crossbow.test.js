Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Crossbow", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Crossbow'],
        hand: ['Tools'],
      },
      micah: {
        hand: ['Sailing', 'Karaoke'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Crossbow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Crossbow'],
        score: ['Karaoke'],
      },
      micah: {
        hand: ['Sailing'],
        blue: ['Tools'],
      },
    })
  })
})
