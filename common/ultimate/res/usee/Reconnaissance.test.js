Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Reconnaissance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Reconnaissance', 'Tools'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Canning'],
        },
        usee: {
          6: ['Sabotage'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Reconnaissance')
    request = t.choose(game, 'Canning', 'Sabotage')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Reconnaissance', 'Tools'],
          splay: 'right',
        },
        hand: ['Atomic Theory'],
      },
    })
  })

})
