Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Witch Trial', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Witch Trial')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
    })
  })

})