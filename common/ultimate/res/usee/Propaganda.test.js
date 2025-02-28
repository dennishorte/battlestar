Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Propaganda', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Propaganda'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Propaganda')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Propaganda'],
      },
    })
  })

})