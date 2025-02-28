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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Soap')
    const request3 = t.choose(game, request2, 'yellow')
    const request4 = t.choose(game, request3, 'Agriculture', 'Masonry', 'Domestication')
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5, 'Sailing')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Soap')
    const request3 = t.choose(game, request2, 'yellow')
    const request4 = t.choose(game, request3, 'Agriculture', 'Masonry', 'Domestication')
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Soap', 'Agriculture', 'Masonry', 'Domestication'],
        score: ['Canning'],
        hand: ['Sailing'],
      },
    })
  })

  test('dogma: tuck only two', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Soap'],
        score: ['Canning'],
        hand: ['Agriculture', 'Masonry', 'Domestication', 'Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Soap')
    const request3 = t.choose(game, request2, 'yellow')
    const request4 = t.choose(game, request3, 'Agriculture', 'Masonry')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Soap', 'Agriculture', 'Masonry'],
        score: ['Canning'],
        hand: ['Domestication', 'Sailing'],
      },
    })
  })
})
