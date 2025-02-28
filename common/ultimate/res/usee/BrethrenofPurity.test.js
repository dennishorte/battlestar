Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Brethren of Purity', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Brethren of Purity')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
      },
    })
  })

})