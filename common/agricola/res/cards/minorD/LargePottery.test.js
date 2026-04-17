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
    // vps (3) are now in getCardPoints; getBonusPoints holds exchange only.
    expect(dennis.getCardPoints()).toBe(3)
    expect(dennis.getBonusPoints()).toBe(1)
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
    expect(dennis.getCardPoints()).toBe(3)
    expect(dennis.getBonusPoints()).toBe(4)
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
    expect(dennis.getCardPoints()).toBe(3)
    expect(dennis.getBonusPoints()).toBe(0)
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
    // Pottery (2) + LargePottery vps (3) in cardPoints. Exchange: 7 clay on LargePottery = 4 VP.
    expect(dennis.getCardPoints()).toBe(5)
    expect(dennis.getBonusPoints()).toBe(4)
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
    expect(dennis.getCardPoints()).toBe(5)
    expect(dennis.getBonusPoints()).toBe(5)
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
    expect(dennis.getCardPoints()).toBe(5)
    expect(dennis.getBonusPoints()).toBe(6)
  })

  test('breakdowns split base VP into cardPoints and exchange into bonusPoints', () => {
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
    // Optimal 10-clay split: Pottery gets 3 (1 VP), Large Pottery gets 7 (4 VP from exchange).
    const cardBreakdown = dennis.getCardPointsBreakdown()
    const cardByLabel = Object.fromEntries(cardBreakdown.map(e => [e.label, e.points]))
    expect(cardByLabel['Pottery']).toBe(2)
    expect(cardByLabel['Large Pottery']).toBe(3)
    const cardSum = cardBreakdown.reduce((a, e) => a + e.points, 0)
    expect(cardSum).toBe(dennis.getCardPoints())

    const bonusBreakdown = dennis.getBonusPointsBreakdown()
    const bonusByLabel = Object.fromEntries(bonusBreakdown.map(e => [e.label, e.points]))
    expect(bonusByLabel['Pottery']).toBe(1)
    expect(bonusByLabel['Large Pottery']).toBe(4)
    const bonusSum = bonusBreakdown.reduce((a, e) => a + e.points, 0)
    expect(bonusSum).toBe(dennis.getBonusPoints())
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
