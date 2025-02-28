Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fingerprints', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fingerprints'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fingerprints')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fingerprints'],
      },
    })
  })

})