Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Mafia', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Mafia'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mafia')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Mafia'],
      },
    })
  })

})