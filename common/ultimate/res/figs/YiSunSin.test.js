Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Yi Sun-Sin', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Yi Sun-Sin'],
        green: ['The Wheel'],
      },
      micah: {
        yellow: ['Masonry'],
        red: ['Construction'],
        blue: ['Writing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Yi Sun-Sin')

    t.testChoices(request, ['The Wheel', 'Masonry', 'Construction'])

    request = t.choose(game,request, 'Construction')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Yi Sun-Sin'],
        green: ['The Wheel'],
        score: ['Construction'],
      },
      micah: {
        yellow: ['Masonry'],
        blue: ['Writing'],
      },
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Yi Sun-Sin'],
        purple: {
          cards: ['Enterprise', 'Education'],
          splay: 'up'
        },
      },
      micah: {
        purple: ['Monotheism'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Yi Sun-Sin')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Yi Sun-Sin'],
        purple: {
          cards: ['Enterprise', 'Education', 'Monotheism'],
          splay: 'up'
        },
        hand: ['Engineering']
      },
    })
  })
})
