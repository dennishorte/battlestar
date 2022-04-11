Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe("Complex Numbers", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        blue: ["Complex Numbers"],
        red: ['Metalworking'],
        hand: ['The Wheel'],
      },
      achievements: ['Tools', 'Calendar'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Complex Numbers')
    const request3 = t.choose(game, request2, 'The Wheel')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ["Complex Numbers"],
        red: ['Metalworking'],
        hand: ['The Wheel'],
        achievements: ['Tools'],
      },
    })
  })
})
