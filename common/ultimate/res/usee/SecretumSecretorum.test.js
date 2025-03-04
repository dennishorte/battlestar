Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secretum Secretorum', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Secretum Secretorum'],
        hand: ['Masonry', 'Optics', 'Tools'],
        score: ['Domestication', 'Myth'],
      },
      decks: {
        base: {
          4: ['Reformation'],
        },
        usee: {
          4: ['El Dorado'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secretum Secretorum')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Reformation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Secretum Secretorum'],
        purple: ['Reformation'],
        score: ['El Dorado'],
      },
    })
  })

})
