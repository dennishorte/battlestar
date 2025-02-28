Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Slot Machine', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Slot Machine'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Slot Machine')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Slot Machine'],
      },
    })
  })

})