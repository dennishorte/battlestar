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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Saladin')
    request = t.choose(game, request, 'Homer')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Saladin')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'green')

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
