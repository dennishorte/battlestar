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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Education'],
        score: ['Software'],
        museum: ['Museum 1', 'Necronomicon'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        score: ['Software'],
        museum: ['Museum 1', 'Necronomicon'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Engineering', 'Archery'],
        hand: ['Tools', 'Paper'],
        score: ['Software'],
        museum: ['Museum 1', 'Necronomicon'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Optics'],
        museum: ['Museum 1', 'Necronomicon'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        hand: ['Tools', 'Translation', 'Computers'],
        score: ['Software'],
        museum: ['Museum 1', 'Necronomicon'],
      },
    })
  })
})
