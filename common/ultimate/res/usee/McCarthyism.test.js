Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('McCarthyism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['McCarthyism'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.McCarthyism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['McCarthyism'],
      },
    })
  })

})