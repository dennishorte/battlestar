Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Invention')

    t.testChoices(request, ['blue'])

    request = t.choose(game, request, 'blue')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Invention')

    t.testChoices(request, ['blue'])

    request = t.choose(game, request)

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Invention')
    request = t.choose(game, request)

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
