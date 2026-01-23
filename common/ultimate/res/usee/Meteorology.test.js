Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Meteorology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Meteorology'],
      },
      decks: {
        usee: {
          3: ['Cliffhanger'],
        },
      },
      achievements: ['Zen'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Meteorology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Meteorology'],
        score: ['Cliffhanger'],
        achievements: ['Zen'],
      },
    })
  })

})
