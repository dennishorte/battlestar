Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Jet'],
        hand: ['Lighting'],
      },
      micah: {
        purple: ['Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Jet')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Jet'],
        purple: ['Lighting'],
      },
    })
  })

  test('dogma: no meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Jet'],
      },
      micah: {
        purple: ['Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Jet')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Jet'],
      },
      micah: {
        purple: ['Enterprise'],
      }
    })
  })
})
