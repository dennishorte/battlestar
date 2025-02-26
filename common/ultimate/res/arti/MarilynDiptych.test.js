Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Marilyn Diptych", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Marilyn Diptych"],
        hand: ['Software'],
        score: ['Robotics', 'Astronomy', 'Canning'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Software')
    const request4 = t.choose(game, request3, 'Astronomy')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        hand: ['Astronomy'],
        score: ['Robotics', 'Software', 'Canning'],
      },
    })
  })

  test('dogma: 25 points', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Marilyn Diptych"],
        hand: ['Software'],
        score: ['Robotics', 'Astronomy', 'Canning'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Software')
    const request4 = t.choose(game, request3, 'Canning')

    t.testGameOver(request4, 'dennis', 'Marilyn Diptych')
  })
})
