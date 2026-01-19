Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Magnifying Glass", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Magnifying Glass'],
        yellow: ['Machinery', 'Agriculture'],
        hand: ['Sailing', 'Enterprise', 'Gunpowder'],
      },
      decks: {
        base: {
          6: ['Canning']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magnifying Glass')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 4)
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Magnifying Glass'],
        yellow: {
          cards: ['Machinery', 'Agriculture'],
          splay: 'left'
        },
        hand: ['Canning']
      },
    })
  })
})
