Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Scouting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Scouting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
    })
  })

})