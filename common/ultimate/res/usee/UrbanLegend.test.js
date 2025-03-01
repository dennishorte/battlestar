Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Urban Legend', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Urban Legend'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Urban Legend')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Urban Legend'],
      },
    })
  })

})