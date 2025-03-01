Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fortune Cookie', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Fortune Cookie'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fortune Cookie')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Fortune Cookie'],
      },
    })
  })

})