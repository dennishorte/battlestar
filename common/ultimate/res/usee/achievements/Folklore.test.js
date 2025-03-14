Error.stackTraceLimit = 100
const t = require('../../../testutil.js')

describe('Folklore', () => {

  test('dogma: claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Empiricism'],
        achievements: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Empiricism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Empiricism'],
        achievements: ['Tools', 'Folklore'],
      }
    })
  })

  test('dogma: has a factory', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Combustion'],
        hand: ['Empiricism'],
        achievements: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Empiricism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Combustion'],
        purple: ['Empiricism'],
        achievements: ['Tools'],
      }
    })
  })

  test('dogma: does not have a 8', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Sanitation'],
        achievements: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Sanitation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sanitation'],
        achievements: ['Tools'],
      }
    })
  })

})
