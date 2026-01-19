Error.stackTraceLimit = 100
import t from '../../testutil.js'
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
    request = t.choose(game, request, 'Dogma.Reconnaissance')
    request = t.choose(game, request, 'Canning', 'Sabotage')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'blue')

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
