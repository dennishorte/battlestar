Error.stackTraceLimit = 100
const t = require('../../../testutil.js')

describe('Mystery', () => {

  test('dogma: claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Flight'],
        green: ['Paper'],
        blue: ['Tools'],
        hand: ['Services'],
      },
      achievements: ['Mystery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Services')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        green: ['Paper'],
        blue: ['Tools'],
        purple: ['Services'],
        achievements: ['Mystery'],
      }
    })
  })

  test('dogma: has five colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Paper'],
        blue: ['Tools'],
        red: ['Combustion'],
        yellow: ['Canning'],
        hand: ['Services'],
      },
      achievements: ['Mystery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Services')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        blue: ['Tools'],
        red: ['Combustion'],
        yellow: ['Canning'],
        purple: ['Services'],
      }
    })
  })

  test('dogma: does not have a 9', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Flight'],
        green: ['Paper'],
        blue: ['Tools'],
        hand: ['Antibiotics'],
      },
      achievements: ['Mystery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Antibiotics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        green: ['Paper'],
        blue: ['Tools'],
        yellow: ['Antibiotics'],
      }
    })
  })

})
