Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Chongqing', () => {

  test('dogma: short stack', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Chongqing'],
      },
      decks: {
        base: {
          9: ['Computers'],
          10: ['Software'],
        },
        city: {
          8: ['Kiev'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Chongqing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Chongqing'],
        hand: ['Computers', 'Software', 'Kiev'],
      },
    })
  })

})
