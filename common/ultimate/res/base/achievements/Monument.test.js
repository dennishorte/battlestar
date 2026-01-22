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

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Statistics')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Statistics')

    t.testIsSecondPlayer(game)
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
