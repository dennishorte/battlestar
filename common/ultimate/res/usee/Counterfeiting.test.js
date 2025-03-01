Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Counterfeiting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Counterfeiting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Counterfeiting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Counterfeiting'],
      },
    })
  })

})