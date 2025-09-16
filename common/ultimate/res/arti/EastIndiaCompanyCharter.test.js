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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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
