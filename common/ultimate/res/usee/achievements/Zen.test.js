Error.stackTraceLimit = 100
const t = require('../../../testutil.js')

describe('Zen', () => {

  test('dogma: claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Democracy'],
      },
      achievements: ['Zen'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Democracy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Democracy'],
        achievements: ['Zen'],
      }
    })
  })

  test('dogma: has an odd card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Clothing'],
        hand: ['Democracy'],
      },
      achievements: ['Zen'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Democracy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Clothing'],
        purple: ['Democracy'],
      }
    })
  })

  test('dogma: does not have a 8', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Perspective'],
      },
      achievements: ['Zen'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Perspective')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
      }
    })
  })

})
