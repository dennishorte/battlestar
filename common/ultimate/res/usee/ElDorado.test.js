Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('El Dorado', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.El Dorado')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
    })
  })

})