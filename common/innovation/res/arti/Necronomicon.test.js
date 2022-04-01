Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Necronomicon", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Necronomicon"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Education'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Education'],
        score: ['Software'],
      },
    })
  })

  test('dogma: yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Necronomicon"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        score: ['Software'],
      },
    })
  })

  test('dogma: green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Necronomicon"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Paper'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Engineering', 'Archery'],
        hand: ['Tools', 'Paper'],
        score: ['Software'],
      },
    })
  })

  test('dogma: red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Necronomicon"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Optics'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Optics'],
      },
    })
  })

  test('dogma: blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Necronomicon"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools'],
        score: ['Software'],
      },
      decks: {
        base: {
          3: ['Translation'],
          9: ['Computers'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Translation', 'Computers'],
        score: ['Software'],
      },
    })
  })
})
