Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Camouflage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Camouflage'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Camouflage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Camouflage'],
      },
    })
  })

})