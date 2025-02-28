Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Metric System', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Metric System', 'Tools'],
        red: ['Oars', 'Archery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Metric System')

    t.testChoices(request2, ['green'], 0, 1)

    const request3 = t.choose(game, request2, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Metric System', 'Tools'],
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
          cards: ['Metric System', 'Tools'],
          splay: 'right'
        },
        red: ['Oars', 'Archery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Metric System')

    t.testChoices(request2, ['red'], 0, 1)

    const request3 = t.choose(game, request2, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Metric System', 'Tools'],
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
