Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Jackalope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Jackalope'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jackalope')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Jackalope'],
      },
    })
  })

})