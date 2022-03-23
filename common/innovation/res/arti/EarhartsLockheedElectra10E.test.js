Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Earhart's Lockheed Electra 10E", () => {

  test('dogma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Earhart's Lockheed Electra 10E"],
        red: ['Flight', 'Engineering'],
        purple: ['Lighting', 'Astronomy', 'Enterprise'],
        yellow: ['Canning'],
        blue: ['Calendar', 'Tools'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', "Earhart's Lockheed Electra 10E")
  })

  test('dogma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Earhart's Lockheed Electra 10E"],
        red: ['Flight', 'Engineering'],
        purple: ['Lighting', 'Enterprise'],
        yellow: ['Canning'],
        blue: ['Calendar', 'Tools'],
      },
      achievements: ['Software'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        achievements: ['Software'],
      },
    })
  })
})
