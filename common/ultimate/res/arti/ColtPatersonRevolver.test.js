Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Colt Paterson Revolver', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Colt Paterson Revolver'],
      },
      micah: {
        red: ['Industrialization'],
        hand: ['Coal', 'Enterprise'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      micah: {
        red: ['Industrialization'],
      }
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Colt Paterson Revolver'],
      },
      micah: {
        red: ['Industrialization'],
        hand: ['Coal', 'Experimentation'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        red: ['Industrialization'],
        hand: ['Coal', 'Experimentation', 'Lighting'],
        score: ['Sailing'],
      }
    })
  })
})
