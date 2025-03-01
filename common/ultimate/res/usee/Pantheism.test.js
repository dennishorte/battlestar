Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pantheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pantheism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pantheism')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pantheism'],
      },
    })
  })

})