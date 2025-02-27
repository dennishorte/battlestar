Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Monument achievement', () => {
  test('3 on top', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Monotheism'],
        hand: ['Statistics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Statistics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Monotheism'],
        yellow: ['Statistics'],
        achievements: [],
      },
    })
  })

  test('4 on top', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Monotheism'],
        green: ['Databases'],
        hand: ['Statistics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Statistics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        purple: ['Monotheism'],
        green: ['Databases'],
        yellow: ['Statistics'],
        achievements: ['Monument'],
      },
    })
  })
})
