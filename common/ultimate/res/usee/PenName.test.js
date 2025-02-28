Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pen Name', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pen Name'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pen Name')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pen Name'],
      },
    })
  })

})