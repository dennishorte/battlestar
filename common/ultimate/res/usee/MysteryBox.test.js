Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Mystery Box', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Mystery Box'],
        hand: ['Software'],
      },
      achievements: ['Domestication'],
      decks: {
        usee: {
          1: ['Polytheism'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mystery Box')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mystery Box'],
        blue: ['Software'],
        hand: ['Polytheism'],
        achievements: ['Domestication'],
      },
    })
  })

})
