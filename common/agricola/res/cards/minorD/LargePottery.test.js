const t = require('../../../testutil_v2.js')

describe('Large Pottery', () => {
  test('getEndGamePoints: 3 clay → 1 bonus point', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['large-pottery-d060'],
        clay: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // getBonusPoints includes vps (3) + getEndGamePoints result
    // 3 clay → 1 bonus point → total 4
    expect(dennis.getBonusPoints()).toBe(4)
  })

  test('getEndGamePoints: 7 clay → 4 bonus points', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['large-pottery-d060'],
        clay: 7,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 7 clay → 4 bonus points + 3 vps = 7
    expect(dennis.getBonusPoints()).toBe(7)
  })

  test('getEndGamePoints: 2 clay → 0 bonus points', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['large-pottery-d060'],
        clay: 2,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 2 clay → 0 bonus points + 3 vps = 3
    expect(dennis.getBonusPoints()).toBe(3)
  })
})
