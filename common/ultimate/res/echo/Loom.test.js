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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Loom')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Loom')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Loom')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Loom')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Loom')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
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
