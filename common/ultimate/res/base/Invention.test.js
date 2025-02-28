Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Invention', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: ['Agriculture', 'Fermenting'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'left'
        },
      },
      decks: {
        base: {
          4: ['Reformation']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Invention')

    t.testChoices(request2, ['blue'])

    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: ['Agriculture', 'Fermenting'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'right',
        },
        score: ['Reformation'],
      },
    })
  })

  test('dogma (no splay)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: ['Agriculture', 'Fermenting'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'left'
        },
      },
      decks: {
        base: {
          4: ['Reformation']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Invention')

    t.testChoices(request2, ['blue'])

    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: ['Agriculture', 'Fermenting'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'left',
        },
      },
    })
  })

  test('dogma (Wonder)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up'
        },
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'left'
        },
        red: {
          cards: ['Archery', 'Gunpowder'],
          splay: 'left'
        },
        purple: {
          cards: ['Monotheism', 'Code of Laws'],
          splay: 'right'
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Invention')
    const request3 = t.choose(game, request2)

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Invention', 'The Wheel'],
          splay: 'right'
        },
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up'
        },
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'left'
        },
        red: {
          cards: ['Archery', 'Gunpowder'],
          splay: 'left'
        },
        purple: {
          cards: ['Monotheism', 'Code of Laws'],
          splay: 'right'
        },
        achievements: ['Wonder'],
      },
    })
  })
})
