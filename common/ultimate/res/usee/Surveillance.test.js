Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Surveillance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Surveillance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
      },
    })
  })

})