Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Knights Templar', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Knights Templar'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Knights Templar')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Knights Templar'],
      },
    })
  })

})