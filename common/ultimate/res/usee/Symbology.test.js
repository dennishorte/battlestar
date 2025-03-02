Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Symbology', () => {

  test('dogma: one of two', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Symbology'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Symbology'],
      },
    })
  })

  test('dogma: two of two', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Proverb'],
        purple: ['Symbology'],
      },
      decks: {
        usee: {
          2: ['Exile'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb'],
        purple: ['Symbology'],
        hand: ['Exile'],
      },
    })
  })

  test('dogma: two of three', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Metalworking'],
        yellow: ['Woodworking'],
        blue: ['Proverb'],
        purple: ['Symbology'],
      },
      decks: {
        usee: {
          2: ['Exile'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Metalworking'],
        yellow: ['Woodworking'],
        blue: ['Proverb'],
        purple: ['Symbology'],
        hand: ['Exile'],
      },
    })
  })

  test('dogma: three of three', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking'],
          splay: 'left',
        },
        yellow: ['Woodworking'],
        blue: ['Proverb'],
        purple: ['Symbology'],
      },
      decks: {
        usee: {
          3: ['Cliffhanger'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking'],
          splay: 'left',
        },
        yellow: ['Woodworking'],
        blue: ['Proverb'],
        purple: ['Symbology'],
        hand: ['Cliffhanger'],
      },
    })
  })

  test('dogma: three of four', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking'],
          splay: 'left',
        },
        yellow: ['Woodworking'],
        green: {
          cards: ['Databases', 'Teleprompter'],
          splay: 'aslant',
        },
        blue: ['Proverb'],
        purple: ['Symbology'],
      },
      decks: {
        usee: {
          3: ['Cliffhanger'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking'],
          splay: 'left',
        },
        yellow: ['Woodworking'],
        green: {
          cards: ['Databases', 'Teleprompter'],
          splay: 'aslant',
        },
        blue: ['Proverb'],
        purple: ['Symbology'],
        hand: ['Cliffhanger'],
      },
    })
  })

  test('dogma: four of four', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking', 'Machine Tools', 'Industrialization'],
          splay: 'aslant',
        },
        yellow: ['Woodworking'],
        green: {
          cards: ['Databases', 'Teleprompter'],
          splay: 'aslant',
        },
        blue: ['Proverb'],
        purple: ['Symbology'],
      },
      decks: {
        usee: {
          4: ['Legend'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Pilgrimage', 'Metalworking', 'Machine Tools', 'Industrialization'],
          splay: 'aslant',
        },
        yellow: ['Woodworking'],
        green: {
          cards: ['Databases', 'Teleprompter'],
          splay: 'aslant',
        },
        blue: ['Proverb'],
        purple: ['Symbology'],
        hand: ['Legend'],
      },
    })
  })
})
