Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Soap", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Soap'],
        score: ['Canning'],
        hand: ['Agriculture', 'Masonry', 'Domestication', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Soap')
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'Agriculture', 'Masonry', 'Domestication')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Soap', 'Agriculture', 'Masonry', 'Domestication'],
        score: ['Canning'],
        achievements: ['Sailing'],
      },
    })
  })

  test('dogma: choose not to achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Soap'],
        score: ['Canning'],
        hand: ['Agriculture', 'Masonry', 'Domestication', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Soap')
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'Agriculture', 'Masonry', 'Domestication')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Soap', 'Agriculture', 'Masonry', 'Domestication'],
        score: ['Canning'],
        hand: ['Sailing'],
      },
    })
  })
})
