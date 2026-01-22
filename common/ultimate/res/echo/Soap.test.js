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
    request = t.choose(game, 'Dogma.Soap')
    request = t.choose(game, 'yellow')
    request = t.choose(game, 'Agriculture', 'Masonry', 'Domestication')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Sailing')

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
    request = t.choose(game, 'Dogma.Soap')
    request = t.choose(game, 'yellow')
    request = t.choose(game, 'Agriculture', 'Masonry', 'Domestication')
    request = t.choose(game, 'auto')
    request = t.choose(game)

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
