Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Fashion Mask', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Fashion Mask', 'Agriculture'],
        purple: ['Railroad', 'Lighting', 'Reformation', 'Code of Laws', 'Monotheism', 'Enterprise', 'Legend'],
        green: ['Electricity', 'Navigation', 'Paper'],
        red: ['Flight', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fashion Mask')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Electricity')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Fashion Mask', 'Agriculture'],
          splay: 'aslant',
        },
        purple: {
          cards: ['Lighting', 'Reformation', 'Code of Laws', 'Monotheism', 'Enterprise'],
          splay: 'aslant',
        },
        green: ['Navigation', 'Paper'],
        red: ['Metalworking', 'Flight'],
        score: ['Legend', 'Railroad'],
        safe: ['Electricity'],
      },
    })
  })

})
