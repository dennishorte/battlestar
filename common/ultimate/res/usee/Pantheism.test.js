Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pantheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pantheism'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pantheism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pantheism'],
      },
    })
  })

})