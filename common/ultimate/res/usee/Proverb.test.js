Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Proverb', () => {

  test('dogma: yellow or purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Proverb'],
        hand: ['Fermenting'],
      },
      decks: {
        usee: {
          1: ['Tomb'],
        }
      },
      achievements: ['Domestication', 'Construction', 'Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Proverb')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb'],
        safe: ['Construction'],
      },
    })
  })

  test('dogma: not yellow or purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Proverb'],
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel'],
        },
        usee: {
          1: ['Silk'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Proverb')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb'],
        hand: ['Tools', 'The Wheel'],
      },
    })
  })

})
