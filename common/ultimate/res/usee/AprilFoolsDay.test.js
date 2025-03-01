Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('April Fool's Day', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['April Fool's Day'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.April Fool's Day')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['April Fool's Day'],
      },
    })
  })

})