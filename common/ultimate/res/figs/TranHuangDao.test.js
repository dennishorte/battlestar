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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tran Huang Dao')

    t.testChoices(request, ['Tran Huang Dao', 'Engineering'])

    request = t.choose(game, request, 'Engineering')

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

    let request
    request = game.run()

    expect(t.dennis(game).biscuits()).toStrictEqual({
      c: 3,
      f: 0,
      i: 0,
      k: 5,
      l: 0,
      s: 4,
    })
  })
})
