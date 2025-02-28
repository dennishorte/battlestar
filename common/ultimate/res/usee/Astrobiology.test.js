Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Astrobiology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrobiology'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Astrobiology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Astrobiology'],
      },
    })
  })

})