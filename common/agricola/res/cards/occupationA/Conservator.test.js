const t = require('../../../testutil_v2.js')

describe('Conservator', () => {
  test('allowDirectStoneRenovation: can choose Renovate to Stone from wood house', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['conservator-a087'],
        roomType: 'wood',
        stone: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Renovate to Stone')
    // Single affordable option: no cost choice presented

    t.testBoard(game, {
      dennis: {
        occupations: ['conservator-a087'],
        roomType: 'stone',
        stone: 0,
        reed: 1,
      },
    })
  })

  test('allowDirectStoneRenovation: can skip to stone without clay step', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['conservator-a087'],
        roomType: 'wood',
        stone: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Renovate to Stone')

    const dennis = game.players.byName('dennis')
    expect(dennis.roomType).toBe('stone')
  })
})
