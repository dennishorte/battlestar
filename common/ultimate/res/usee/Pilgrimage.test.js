Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pilgrimage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Pilgrimage'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pilgrimage')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Pilgrimage'],
      },
    })
  })

})