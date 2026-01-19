Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Crossbow')

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
