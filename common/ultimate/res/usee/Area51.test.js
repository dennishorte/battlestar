Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Area 51', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Area 51'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Area 51')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Area 51'],
      },
    })
  })

})