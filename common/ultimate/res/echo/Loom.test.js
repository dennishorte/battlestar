Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Loom", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Loom'],
        blue: ['Translation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Loom')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Loom'],
        score: ['Translation'],
      },
    })
  })

  test('dogma: same age in score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Loom'],
        blue: ['Translation'],
        score: ['Machinery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Loom')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Loom'],
        score: ['Translation', 'Machinery'],
      },
    })
  })

  test('dogma: different ages in score; choose not to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Loom'],
        blue: ['Translation'],
        score: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Loom')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Loom'],
        score: ['Translation', 'Sailing'],
      },
    })
  })

  test('dogma: different ages in score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Loom'],
        blue: ['Translation'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          6: ['Canning', 'Classification', 'Industrialization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Loom')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Loom', 'Industrialization'],
        yellow: ['Canning'],
        green: ['Classification'],
      },
    })
  })

  test('dogma: Heritage', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: {
          cards: ['Loom', 'Archery', 'Metalworking', 'Oars'],
          splay: 'up',
        },
        blue: ['Translation'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          6: ['Canning', 'Classification', 'Industrialization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Loom')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Loom', 'Archery', 'Metalworking', 'Oars', 'Industrialization'],
          splay: 'up',
        },
        yellow: ['Canning'],
        green: ['Classification'],
        achievements: ['Heritage'],
      },
    })
  })
})
