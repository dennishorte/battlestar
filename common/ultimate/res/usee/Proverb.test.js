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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Proverb')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Proverb'],
      },
    })
  })

})