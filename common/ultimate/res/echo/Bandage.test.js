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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bandage')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bandage')

    t.testIsSecondPlayer(game)
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
