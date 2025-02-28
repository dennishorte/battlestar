Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Green Hydrogen', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Green Hydrogen'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Green Hydrogen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Green Hydrogen'],
      },
    })
  })

})