Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Umbrella", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Umbrella'],
        hand: ['Sailing', 'Tools', 'Mathematics', 'Experimentation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Umbrella')
    const request3 = t.choose(game, request2, 'Tools')
    const request4 = t.choose(game, request3, 'Sailing')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        green: ['Umbrella'],
        blue: ['Tools'],
        score: ['Experimentation', 'Mathematics'],
      },
    })
  })
})
