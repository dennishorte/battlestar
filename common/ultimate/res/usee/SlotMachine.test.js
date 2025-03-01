Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Slot Machine', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Slot Machine'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Slot Machine')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Slot Machine'],
      },
    })
  })

})