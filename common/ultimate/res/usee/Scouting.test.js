Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Scouting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scouting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
    })
  })

})