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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Socialism')
    const request3 = t.choose(game, request2, 'Empiricism')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Gene Roddenberry')
    const request3 = t.choose(game, request2, 'Enterprise')

    t.testGameOver(request3, 'dennis', 'Gene Roddenberry')
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Gene Roddenberry')
    const request3 = t.choose(game, request2, 'Reformation')
    const request4 = t.choose(game, request3, 'Alexander the Great')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Gene Roddenberry', 'Reformation'],
        green: ['Navigation'], // needed for biscuits
      },
    })
  })
})
