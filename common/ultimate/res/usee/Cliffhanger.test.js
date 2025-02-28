Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cliffhanger', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
      },
    })
  })

})