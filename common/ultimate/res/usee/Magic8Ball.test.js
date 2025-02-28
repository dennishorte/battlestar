Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Magic 8-Ball', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Magic 8-Ball')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
    })
  })

})