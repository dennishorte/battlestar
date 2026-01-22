Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Teleprompter', () => {

  test('dogma: one card only, single draw', () => {
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
    request = t.choose(game, 'Dogma.Teleprompter')
    request = t.choose(game, 'base')
    request = t.choose(game, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter'],
        purple: ['Polytheism'],
      },
    })
  })

  test('dogma: one card only, multiple draws', () => {
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
    request = t.choose(game, 'Dogma.Teleprompter')
    request = t.choose(game, 'base')
    request = t.choose(game, 1)
    request = t.choose(game, 'base') // can't choose the same deck again
    request = t.choose(game, 1)
    request = t.choose(game, 'base')
    request = t.choose(game, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter', 'Sailing'],
        purple: ['Polytheism'],
      },
    })
  })

})
