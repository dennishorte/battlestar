Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Placebo', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Placebo'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Placebo')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Placebo'],
      },
    })
  })

})