Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Buttonwood Agreement', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Buttonwood Agreement'],
        red: ['Coal', 'Gunpowder'],
      },
      decks: {
        base: {
          8: ['Flight']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'green', 'blue', 'red')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Gunpowder'],
          splay: 'up'
        },
        score: ['Flight'],
      }
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Buttonwood Agreement'],
        red: {
          cards: ['Coal', 'Gunpowder'],
          splay: 'left',
        },
        score: ['Construction', 'Tools'],
      },
      decks: {
        base: {
          8: ['Flight']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'green', 'blue', 'yellow')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Coal', 'Gunpowder'],
        score: ['Tools'],
        hand: ['Flight'],
      }
    })
  })
})
