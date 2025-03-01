Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Parachute", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Parachute'],
      },
      micah: {
        hand: ['Lighting', 'Sailing', 'Computers'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Parachute')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Parachute'],
        hand: ['Lighting', 'Computers'],
      },
      micah: {
        hand: ['Sailing'],
      }
    })
  })
})
