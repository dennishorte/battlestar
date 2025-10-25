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
      achievements: ['Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Software')
    request = t.choose(game, request, 'Astronomy')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Astronomy'],
        score: ['Robotics', 'Software', 'Canning'],
        museum: ['Museum 1', 'Marilyn Diptych'],
      },
      junk: ['Machinery'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Software')
    request = t.choose(game, request, 'Canning')

    t.testGameOver(request, 'dennis', 'Marilyn Diptych')
  })
})
