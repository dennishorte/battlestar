Error.stackTraceLimit = 100
import t from '../../../testutil.js'

describe('Confidence', () => {

  test('dogma: claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Astronomy'],
        safe: ['Tools', 'Optics', 'Coal', 'Mathematics'],
      },
      achievements: ['Confidence'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        safe: ['Tools', 'Optics', 'Coal', 'Mathematics'],
        achievements: ['Confidence'],
      }
    })
  })

  test('dogma: has three secrets', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Astronomy'],
        safe: ['Tools', 'Optics', 'Coal'],
      },
      achievements: ['Confidence'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        safe: ['Tools', 'Optics', 'Coal'],
      }
    })
  })

  test('dogma: does not have a 7', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Perspective'],
      },
      achievements: ['Confidence'],
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
