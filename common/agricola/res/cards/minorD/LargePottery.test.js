const t = require('../../../testutil_v2.js')

describe('Large Pottery', () => {
  test('3 clay → 1 bonus point', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['large-pottery-d060'],
        clay: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // getBonusPoints includes vps (3) + exchange bonus
    // 3 clay → 1 bonus point → total 4
    expect(dennis.getBonusPoints()).toBe(4)
  })

  test('7 clay → 4 bonus points', () => {
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

  test('2 clay → 0 bonus points', () => {
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

  test('combined with Pottery: 7 clay auto-optimizes to LargePottery alone (4 VP)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['pottery'],
        minorImprovements: ['large-pottery-d060'],
        clay: 7,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Exchange: all 7 clay on LargePottery = 4 VP (beats Pottery 3 VP or any split).
    // getBonusPoints = 3 (LargePottery vps) + 4 (exchange) = 7.
    // (Pottery's 2 victoryPoints go through getCardPoints, not getBonusPoints.)
    expect(dennis.getBonusPoints()).toBe(7)
  })

  test('combined with Pottery: 10 clay splits 3+7 for 5 VP', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['pottery'],
        minorImprovements: ['large-pottery-d060'],
        clay: 10,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Optimal: 3 → Pottery (1 VP) + 7 → LargePottery (4 VP) = 5 VP
    // getBonusPoints = 3 (LargePottery vps) + 5 (exchange) = 8
    expect(dennis.getBonusPoints()).toBe(8)
  })

  test('combined with Pottery: 12 clay splits 5+7 for 6 VP', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['pottery'],
        minorImprovements: ['large-pottery-d060'],
        clay: 12,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Optimal: 5 → Pottery (2 VP) + 7 → LargePottery (4 VP) = 6 VP
    // getBonusPoints = 3 + 6 = 9
    expect(dennis.getBonusPoints()).toBe(9)
  })

  test('endGame commits exchange: deducts clay and locks in bonus', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        majorImprovements: ['pottery'],
        minorImprovements: ['large-pottery-d060'],
        clay: 10,
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis (+1 clay)
    t.choose(game, 'Grain Seeds')   // micah
    t.choose(game, 'Feed family')   // dennis feeds (skip food conversions)

    const dennis = game.players.byName('dennis')
    // Exchange spends 10 clay (3 Pottery + 7 LargePottery). Clay Pit added 1 → final clay = 1.
    expect(dennis.clay).toBe(1)
    // Exchange bonus = 5 VP (1 from Pottery + 4 from LargePottery).
    expect(dennis.bonusPoints).toBe(5)
  })
})
