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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pen Name')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pen Name'],
      },
    })
  })

})