Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Philosopher's Stone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Philosopher's Stone"],
        hand: ['Calendar', 'Mathematics', 'Tools', 'Sailing']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Calendar')
    const request4 = t.choose(game, request3, 'Tools', 'Sailing')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsFirstAction(request5)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing'],
        hand: ['Mathematics'],
      },
    })
  })
})
