Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Helicopter", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Helicopter'],
        blue: ['Software'],
        hand: ['Coal'],
      },
      micah: {
        yellow: ['Canning'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Helicopter')
    request = t.choose(game, 'Canning')
    request = t.choose(game, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Helicopter'],
        score: ['Software'],
      },
      micah: {
        score: ['Canning'],
      }
    })
  })
})
