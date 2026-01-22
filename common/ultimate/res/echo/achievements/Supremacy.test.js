Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Supremacy Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
        hand: ['Mysticism'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Mysticism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
        purple: ['Mysticism'],
        achievements: ['Supremacy'],
      },
    })
  })
})
