Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Teleprompter', () => {

  test('dogma: one card only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
      decks: {
        base: {
          2: ['Monotheism'],
        },
        usee: {
          1: ['Polytheism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Teleprompter')
    request = t.choose(game, request, 'base')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter'],
        purple: ['Polytheism'],
      },
    })
  })

  test('dogma: one card only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          2: ['Monotheism'],
        },
        usee: {
          1: ['Polytheism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Teleprompter')
    request = t.choose(game, request, 'base')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'base') // can't choose the same deck again
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'base')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter', 'Sailing'],
        purple: ['Polytheism'],
      },
    })
  })

})
