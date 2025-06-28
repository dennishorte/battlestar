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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jet')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jet')

    t.testIsSecondPlayer(game)
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
