Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Air Conditioner", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Air Conditioner'],
        blue: ['Pottery'],
        hand: ['Mathematics'],
      },
      micah: {
        yellow: ['Stem Cells'],
        green: ['Navigation'],
        blue: ['Tools'],
        red: ['Oars'],
        score: ['The Wheel', 'Gunpowder', 'Coal'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Air Conditioner')
    request = t.choose(game, 'Mathematics')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Air Conditioner'],
        blue: ['Pottery'],
        score: ['Mathematics'],
      },
      micah: {
        yellow: ['Stem Cells'],
        green: ['Navigation'],
        blue: ['Tools'],
        red: ['Oars'],
        score: ['Coal'],
      },
    })
  })
})
