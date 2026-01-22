Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Metric System', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Metric System', 'Sailing'],
        red: ['Oars', 'Archery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Metric System')

    t.testChoices(request, ['green'], 0, 1)

    request = t.choose(game, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Metric System', 'Sailing'],
          splay: 'right'
        },
        red: ['Oars', 'Archery'],
      },
    })
  })

  test('dogma (green splayed right)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Metric System', 'Sailing'],
          splay: 'right'
        },
        red: ['Oars', 'Archery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Metric System')

    t.testChoices(request, ['red'], 0, 1)

    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Metric System', 'Sailing'],
          splay: 'right'
        },
        red: {
          cards: ['Oars', 'Archery'],
          splay: 'right'
        }
      },
    })
  })
})
