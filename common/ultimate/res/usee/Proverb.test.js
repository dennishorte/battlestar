Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Proverb', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Proverb'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Proverb')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb'],
      },
    })
  })

})