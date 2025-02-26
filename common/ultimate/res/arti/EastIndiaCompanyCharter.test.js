Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('East India Company Charter', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['East India Company Charter'],
        score: ['Construction', 'Tools', 'Gunpowder'],
      },
      micah: {
        score: ['Calendar', 'Fermenting', 'Engineering'],
      },
      decks: {
        base: {
          5: ['Astronomy', 'Chemistry'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 2)
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Gunpowder', 'Astronomy', 'Chemistry'],
      },
      micah: {
        score: ['Engineering'],
      },
    })
  })

  test('dogma: interaction with prevent return karmas', () => {

    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['East India Company Charter'],
        score: ['Construction', 'Tools', 'Gunpowder'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Calendar', 'Fermenting', 'Engineering'],
      },
      decks: {
        base: {
          5: ['Astronomy'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 2)
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Gunpowder', 'Astronomy'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Calendar', 'Fermenting', 'Engineering'],
      },
    })
  })
})
