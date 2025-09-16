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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Complex Numbers')
    request = t.choose(game, request, 'The Wheel')

    t.testIsSecondPlayer(game)
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
