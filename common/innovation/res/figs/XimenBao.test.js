Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ximen Bao', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ximen Bao'],
        green: ['The Wheel'],
        hand: ['Sailing'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')


    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ximen Bao'],
        green: ['The Wheel', 'Sailing'],
        hand: ['Calendar'],
      },
    })
  })

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

    const request1 = game.run()

    t.testActionChoices(request1, 'Inspire', ['yellow', 'purple', 'red'])

    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Archery')
    const request4 = t.choose(game, request3, 'Monotheism')
    const request5 = t.choose(game, request4, 'Ximen Bao')

    t.testIsSecondPlayer(request5)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ximen Bao')
    const request3 = t.choose(game, request2, 2)

    t.testIsSecondPlayer(request3)
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
