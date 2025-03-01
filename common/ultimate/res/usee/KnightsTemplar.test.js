Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Knights Templar', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Knights Templar'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Knights Templar')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Knights Templar'],
      },
    })
  })

})