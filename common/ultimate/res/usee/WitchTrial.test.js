Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Witch Trial', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Witch Trial')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
    })
  })

})