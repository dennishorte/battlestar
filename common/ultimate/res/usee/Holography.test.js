Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Holography', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Holography')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
      },
    })
  })

})