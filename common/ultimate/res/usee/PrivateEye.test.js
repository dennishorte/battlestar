Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Private Eye', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Private Eye'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Private Eye')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Private Eye'],
      },
    })
  })

})