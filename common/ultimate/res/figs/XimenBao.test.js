Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ximen Bao', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Ximen Bao', 'Expansion')
  })

  test('karma: inspire effects', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ximen Bao'],
        purple: {
          cards: ['Code of Laws', 'Homer', 'Ptahotep'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Tigernmas'],
          splay: 'up',
        },
        hand: ['Monotheism'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Construction', 'Mapmaking'],
        }
      }
    })

    let request
    request = game.run()

    t.testActionChoices(request, 'Inspire', ['yellow', 'purple', 'red'])

    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Archery')
    request = t.choose(game, request, 'Monotheism')
    request = t.choose(game, request, 'Ximen Bao')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Code of Laws', 'Homer', 'Ptahotep', 'Monotheism'],
          splay: 'right'
        },
        red: ['Tigernmas', 'Construction'],
        hand: ['Tools', 'Mapmaking'],
        score: ['Archery', 'Ximen Bao']
      },
    })

  })

  test('karma: echo effects', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ximen Bao'],
        purple: {
          cards: ['Code of Laws', 'Sinuhe'],
          splay: 'right'
        },
        blue: {
          cards: ['Tools', 'Huang Di'],
          splay: 'up',
        },
        hand: ['Monotheism'],
      },
      decks: {
        base: {
          2: ['Construction', 'Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ximen Bao')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ximen Bao'],
        purple: {
          cards: ['Code of Laws', 'Sinuhe'],
          splay: 'right'
        },
        blue: {
          cards: ['Tools', 'Huang Di'],
          splay: 'up',
        },
        hand: ['Monotheism', 'Construction'],
        forecast: ['Mapmaking'],
      },
    })

  })
})
