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
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Colt Paterson Revolver'],
      },
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
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Colt Paterson Revolver'],
      },
      micah: {
        red: ['Industrialization'],
        hand: ['Coal', 'Experimentation', 'Lighting'],
        score: ['Sailing'],
      }
    })
  })
})
