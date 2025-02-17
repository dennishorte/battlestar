Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Caresse Crosby', () => {

  test('inspire (no leaf, so no karma trigger)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        green: ['Navigation', 'Sailing'],
        yellow: ['Caresse Crosby', 'Fermenting'],
        hand: ['Clothing', 'Metalworking'],
      },
      decks: {
        base: {
          8: ['Quantum Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testChoices(request2, ['Clothing', 'Metalworking'])

    const request3 = t.choose(game, request2, 'Metalworking')

    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Metalworking'],
        green: ['Navigation', 'Sailing'],
        yellow: ['Caresse Crosby', 'Fermenting'],
        hand: ['Clothing', 'Quantum Theory'],
      },
    })
  })

  test('karma: if you would tuck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Navigation', 'Sailing'],
        yellow: ['Caresse Crosby', 'Fermenting'],
        hand: ['Clothing'],
      },
      decks: {
        base: {
          2: ['Construction', 'Calendar'],
          8: ['Quantum Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Navigation', 'Sailing', 'Clothing'],
          splay: 'left'
        },
        yellow: ['Caresse Crosby', 'Fermenting'],
        hand: ['Construction', 'Calendar', 'Quantum Theory'],
      },
    })
  })

  test('karma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: {
          cards: ['Calendar', 'Tools'],
          splay: 'left'
        },
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: ['Navigation', 'Sailing'],
        hand: ['The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Code of Laws')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'green')

    t.testGameOver(request4, 'dennis', 'Caresse Crosby')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: {
          cards: ['Calendar', 'Tools'],
          splay: 'left'
        },
        purple: {
          cards: ['Lighting', 'Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: ['Navigation', 'Sailing', 'The Wheel'],
        hand: [],
      },
    })
  })

  test.only('karma: splay right from none', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: ['Atomic Theory', 'Calendar', 'Tools'],
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          7: ['Railroad'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Atomic Theory')
    const request3 = t.choose(game, request2, 'blue')

    t.testNotGameOver(request3)

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: {
          cards: ['Atomic Theory', 'Calendar', 'Tools'],
          splay: 'right',
        },
        purple: {
          cards: ['Railroad', 'Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
    })
  })

  test.only('karma: splay right from left', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: {
          cards: ['Atomic Theory', 'Calendar', 'Tools'],
          splay: 'left',
        },
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: {
          cards: ['Invention', 'Sailing'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        }
      }

    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Invention')
    const request3 = t.choose(game, request2, 'blue')

    t.testNotGameOver(request3)

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'left'
        },
        yellow: {
          cards: ['Caresse Crosby', 'Fermenting'],
          splay: 'left'
        },
        blue: {
          cards: ['Atomic Theory', 'Calendar', 'Tools'],
          splay: 'right',
        },
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: {
          cards: ['Invention', 'Sailing'],
          splay: 'left',
        },
        hand: ['The Wheel'],
        score: ['Gunpowder'], 
        achievements: ["Wonder"],
      },
    })
  })

})
