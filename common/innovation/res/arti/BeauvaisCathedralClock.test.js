Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Beauvais Cathedral Clock', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Beauvais Cathedral Clock'],
        red: ['Coal', 'Construction'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
        hand: ['Gunpowder'],
      }
    })
  })
})
