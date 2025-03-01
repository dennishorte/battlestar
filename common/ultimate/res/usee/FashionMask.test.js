Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fashion Mask', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fashion Mask'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fashion Mask')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fashion Mask'],
      },
    })
  })

})