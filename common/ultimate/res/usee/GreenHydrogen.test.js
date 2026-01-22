Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Green Hydrogen', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Green Hydrogen', 'Navigation', 'Paper'],
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        },
        usee: {
          11: ['Astrobiology'],
        },
      },

    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Green Hydrogen')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        blue: ['Astrobiology'],
        green: ['Green Hydrogen'],
        score: ['Navigation', 'Paper'],
      },
    })
  })

})
