Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fight Club', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Fight Club'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fight Club')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fight Club'],
      },
    })
  })

})