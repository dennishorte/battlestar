Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Quackery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quackery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quackery'],
      },
    })
  })

})