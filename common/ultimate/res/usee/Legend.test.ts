Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Legend', () => {

  test('dogma: short stack', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Legend'],
        green: ['Navigation', 'Sailing'],
      },
      micah: {
        score: ['Construction'],
      },
      decks: {
        usee: {
          1: ['Polytheism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Legend')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Polytheism', 'Legend'],
        score: ['Navigation', 'Sailing'],
      },
      micah: {
        score: ['Construction'],
      },
    })
  })

  test('dogma: maxed points', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Legend'],
        green: ['Databases', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Legend')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Legend'],
        green: ['Sailing'],
        score: ['Databases'],
      },
    })
  })

})
