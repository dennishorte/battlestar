Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
        museum: ['Museum 1', 'East India Company Charter'],
      },
      micah: {
        score: ['Engineering'],
      },
    })

    const junk = game.cards.byZone('junk')
    expect(junk.length).toBeGreaterThan(4)
  })
})
