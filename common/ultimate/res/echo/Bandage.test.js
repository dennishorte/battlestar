Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bandage", () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Bandage'],
        hand: ['The Wheel', 'Pottery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Bandage')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Bandage'],
        blue: ['Pottery'],
        hand: ['The Wheel'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        purple: ['Lighting'],
        hand: ['Enterprise'],
        score: ['Calendar', 'Gunpowder'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Bandage')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        hand: ['Enterprise'],
        score: ['Gunpowder'],
      },
    })
  })
})
