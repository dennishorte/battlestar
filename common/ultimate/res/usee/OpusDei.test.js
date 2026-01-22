Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Opus Dei', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Opus Dei', 'Monotheism'],
        score: ['Reformation', 'Optics'],
      },
      decks: {
        usee: {
          8: ['Blacklight'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Opus Dei')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Opus Dei', 'Monotheism'],
          splay: 'up',
        },
        score: ['Optics'],
        safe: ['Reformation'],
        hand: ['Blacklight'],
      },
    })
  })

})
