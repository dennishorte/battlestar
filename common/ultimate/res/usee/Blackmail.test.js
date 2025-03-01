Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Blackmail', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Blackmail'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Blackmail')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Blackmail'],
      },
    })
  })

})