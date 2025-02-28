Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Metaverse', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Metaverse'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Metaverse')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Metaverse'],
      },
    })
  })

})