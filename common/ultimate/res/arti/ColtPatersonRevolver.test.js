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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      micah: {
        red: ['Industrialization'],
        hand: ['Coal', 'Experimentation', 'Lighting'],
        score: ['Sailing'],
      }
    })
  })
})
