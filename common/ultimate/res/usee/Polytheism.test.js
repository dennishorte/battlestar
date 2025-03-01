Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Polytheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Polytheism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Polytheism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Polytheism'],
      },
    })
  })

})