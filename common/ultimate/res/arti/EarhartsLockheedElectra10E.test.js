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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', "Earhart's Lockheed Electra 10E")
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        achievements: ['Software'],
      },
    })
  })
})
