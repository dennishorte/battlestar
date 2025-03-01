Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Taqiyya', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Taqiyya')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
      },
    })
  })

})