Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Placebo', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Placebo'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Placebo')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Placebo'],
      },
    })
  })

})