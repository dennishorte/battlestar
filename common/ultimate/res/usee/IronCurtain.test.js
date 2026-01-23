Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Iron Curtain', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Iron Curtain', 'Optics'],
          splay: 'left',
        },
        blue: {
          cards: ['Publications', 'Tools', 'Mathematics'],
          splay: 'up',
        },
        green: ['Paper', 'Navigation'],
      },
      achievements: ['Domestication', 'Monotheism', 'Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Iron Curtain')
    request = t.choose(game, 'auto')
    request = t.choose(game, '**base-1*', '**base-2*')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        blue: ['Tools', 'Mathematics'],
        green: ['Paper', 'Navigation'],
        safe: ['Domestication', 'Monotheism'],
      },
    })
  })

})
