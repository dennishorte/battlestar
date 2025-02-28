Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Counterfeiting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Counterfeiting'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Counterfeiting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Counterfeiting'],
      },
    })
  })

})