Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Escape Room', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Escape Room')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
      },
    })
  })

})