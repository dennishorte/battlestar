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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

    t.testChoices(request, ['Clothing', 'Metalworking'])

    request = t.choose(game, request, 'Metalworking')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'green')

    t.testGameOver(request, 'dennis', 'Caresse Crosby')

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
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'left'
        },
        green: ['Navigation', 'Sailing', 'The Wheel'],
        hand: [],
      },
    })
  })

  test('karma: you win (must be splaying left)', () => {
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
          cards: ['Reformation', 'Mysticism'],
          splay: 'up'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Reformation')
    request = t.choose(game, request, 'no')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)

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
          cards: ['Reformation', 'Mysticism'],
          splay: 'right'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left',
        },
      },
    })
  })
})
