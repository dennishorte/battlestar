Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Saladin', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Saladin'],
        green: ['The Wheel'],
      },
      micah: {
        purple: ['Homer'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Saladin')
    const request3 = t.choose(game, request2, 'Homer')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Saladin'],
        green: ['The Wheel'],
        score: ['Homer'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Saladin', 'War')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Saladin'],
        green: ['Sailing'],
        yellow: ['Masonry'],
      },
      micah: {
        green: ['The Wheel']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Saladin')
    const request3 = t.choose(game, request2, 'The Wheel')
    const request4 = t.choose(game, request3, 'green')

    t.testBoard(game, {
      dennis: {
        red: ['Saladin'],
        yellow: ['Masonry'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left'
        }
      },
    })
  })
})
