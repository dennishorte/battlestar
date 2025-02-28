Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Counterintelligence', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Counterintelligence'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Counterintelligence')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Counterintelligence'],
      },
    })
  })

})