Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Streaming", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Streaming'],
        yellow: ['Fermenting', 'Stove', 'Machinery'],
        score: ['Software'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Streaming')
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'achieve')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stove', 'Machinery'],
        blue: ['Streaming'],
        score: ['Software'],
        achievements: ['Fermenting'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Fermenting', 'Stove', 'Machinery'],
        score: ['Software'],
        hand: ['Astrobiology'],
        forecast: ['Streaming'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Astrobiology')
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'achieve')
    request = t.choose(game, request, 'achieve')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Streaming', 'Astrobiology'],
        score: ['Software', 'Stove'],
        achievements: ['Fermenting', 'Machinery'],
      },
    })
  })
})
