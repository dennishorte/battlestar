Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tran Huang Dao', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tran Huang Dao'],
        yellow: ['Agriculture'],
        green: ['The Wheel'],
      },
      micah: {
        purple: ['Enterprise'],
        yellow: ['Machinery'],
        red: ['Engineering']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tran Huang Dao')

    t.testChoices(request2, ['Tran Huang Dao', 'Engineering'])

    const request3 = t.choose(game, request2, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tran Huang Dao'],
        yellow: ['Agriculture'],
        green: ['The Wheel'],
        score: ['Engineering'],
      },
      micah: {
        yellow: ['Machinery'],
        purple: ['Enterprise'],
      }
    })
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tran Huang Dao'],
        green: ['The Wheel'],
        blue: ['Writing']
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game))).toStrictEqual({
      c: 3,
      f: 0,
      i: 0,
      k: 5,
      l: 0,
      s: 4,
    })
  })
})
