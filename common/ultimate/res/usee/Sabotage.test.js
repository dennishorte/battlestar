Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Sabotage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sabotage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
    })
  })

})