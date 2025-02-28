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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Air Conditioner')
    const request3 = t.choose(game, request2, 'Mathematics')
    const request4 = t.choose(game, request3, 'auto')

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
