Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Niccolo Machiavelli', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Niccolo Machiavelli', 'Code of Laws'],
          splay: 'left'
        },
        blue: {
          cards: ['Computers', 'Mathematics'],
          splay: 'left'
        },
        red: ['Archery', 'Construction']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Niccolo Machiavelli')

    t.testChoices(request2, ['purple', 'blue'])

    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Niccolo Machiavelli', 'Code of Laws'],
          splay: 'right'
        },
        blue: {
          cards: ['Computers', 'Mathematics'],
          splay: 'left'
        },
        red: ['Archery', 'Construction']
      },
    })
  })

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Niccolo Machiavelli', 'Code of Laws'],
          splay: 'right',
        },
        blue: {
          cards: ['Computers', 'Mathematics'],
          splay: 'right',
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'right',
        },
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'left',
        },
        green: ['The Wheel'],
      },
      micah: {
        blue: ['Tools'],
        red: {
          cards: ['Gunpowder', 'Engineering'],
          splay: 'left'
        }
      },
    })

    const request1 = game.run()

    expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
  })
})
