Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gene Roddenberry', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Socialism', 'Gene Roddenberry'],
          splay: 'up',
        }
      },
      micah: {
        purple: ['Empiricism']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Socialism')
    request = t.choose(game, request, 'Empiricism')

    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Empiricism', 'Socialism', 'Gene Roddenberry'],
          splay: 'up',
        }
      },
    })
  })

  test('karma: Enterprise', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Gene Roddenberry'],
        green: ['Navigation'], // needed for biscuits
      },
      micah: {
        purple: ['Enterprise']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gene Roddenberry')
    request = t.choose(game, request, 'Enterprise')

    t.testGameOver(request, 'dennis', 'Gene Roddenberry')
  })

  test('karma: non-Enterprise', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Gene Roddenberry'],
        green: ['Navigation'], // needed for biscuits
      },
      micah: {
        purple: ['Reformation'],
        red: ['Alexander the Great']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gene Roddenberry')
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, 'Alexander the Great')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Gene Roddenberry', 'Reformation'],
        green: ['Navigation'], // needed for biscuits
      },
    })
  })
})
