Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Exile', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Exile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })
  })

})