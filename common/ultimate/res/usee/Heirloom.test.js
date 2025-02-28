Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Heirloom', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Heirloom')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
      },
    })
  })

})