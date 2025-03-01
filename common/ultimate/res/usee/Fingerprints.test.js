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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fingerprints')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fingerprints'],
      },
    })
  })

})