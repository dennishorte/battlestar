Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Shangri-La', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shangri-La'],
      },
      decks: {
        base: {
          8: ['Socialism', 'Mobility'],
        },
        usee: {
          8: ['Jackalope'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Shangri-La')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shangri-La', 'Jackalope'],
        purple: ['Socialism'],
        score: ['Mobility'],
      },
    })
  })

})
