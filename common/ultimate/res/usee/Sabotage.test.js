Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Sabotage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sabotage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
    })
  })

})