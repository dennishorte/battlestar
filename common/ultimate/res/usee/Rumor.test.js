Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Rumor', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Rumor'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rumor')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Rumor'],
      },
    })
  })

})