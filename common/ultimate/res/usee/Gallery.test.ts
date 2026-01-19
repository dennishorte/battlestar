Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Gallery', () => {

  test('dogma: No matching cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Gallery'],
        score: ['Optics', 'Reformation'],
      },
      decks: {
        usee: {
          5: ['Probability'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gallery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Gallery'],
        score: ['Optics', 'Reformation'],
        hand: ['Probability'],
      },
    })
  })

  test('dogma: matching both', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Gallery'],
        score: ['Agriculture', 'Monotheism'],
      },
      decks: {
        base: {
          7: ['Bicycle'],
        },
        usee: {
          6: ['Illuminati'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gallery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Gallery'],
        score: ['Agriculture', 'Monotheism'],
        hand: ['Illuminati', 'Bicycle'],
      },
    })
  })

})
