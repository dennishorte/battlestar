Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Silk', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Silk'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Silk')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Silk'],
      },
    })
  })

})