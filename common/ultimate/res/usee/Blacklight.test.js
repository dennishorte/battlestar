Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Blacklight', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Blacklight'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Blacklight')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Blacklight'],
      },
    })
  })

})