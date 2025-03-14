Error.stackTraceLimit = 100
const t = require('../../../testutil.js')

describe('Anonymity', () => {

  test('dogma: claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Evolution'],
        achievements: ['Monument'],
      },
      achievements: ['Anonymity'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Evolution')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Evolution'],
        achievements: ['Monument', 'Anonymity'],
      }
    })
  })

  test('dogma: has one standard achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Evolution'],
        achievements: ['Monument', 'Tools'],
      },
      achievements: ['Anonymity'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Evolution')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Evolution'],
        achievements: ['Monument', 'Tools'],
      }
    })
  })

  test('dogma: does not have a 7', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Canning'],
        achievements: ['Monument'],
      },
      achievements: ['Anonymity'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning'],
        achievements: ['Monument'],
      }
    })
  })

})
