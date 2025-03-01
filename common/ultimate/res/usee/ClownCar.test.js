Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Clown Car', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Clown Car'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Clown Car')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Clown Car'],
      },
    })
  })

})