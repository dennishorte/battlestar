Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Heirloom', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Heirloom')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
      },
    })
  })

})