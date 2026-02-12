const t = require('../../../testutil_v2.js')

describe('Future Building Site', () => {
  test('blocks room building when non-adjacent empty spaces exist', () => {
    // Grid (3x5): rooms at (0,0) and (1,0)
    // Adjacent to house: (0,1), (1,1), (2,0)
    // Non-adjacent: (0,2)-(0,4), (1,2)-(1,4), (2,1)-(2,4)
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // All valid room build spaces are adjacent to rooms → all restricted
    expect(dennis.getValidRoomBuildSpaces()).toHaveLength(0)
    // (0,1) is adjacent to room (0,0) — restricted
    expect(dennis.canBuildRoom(0, 1)).toBe(false)
    // (1,1) is adjacent to room (1,0) — restricted
    expect(dennis.canBuildRoom(1, 1)).toBe(false)
    // (2,0) is adjacent to room (1,0) — restricted
    expect(dennis.canBuildRoom(2, 0)).toBe(false)
  })

  test('blocks plowing on adjacent spaces but allows non-adjacent', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // (0,1) is adjacent to room — restricted
    expect(dennis.canPlowField(0, 1)).toBe(false)
    // (2,0) is adjacent to room — restricted
    expect(dennis.canPlowField(2, 0)).toBe(false)
    // (2,2) is not adjacent to any room — allowed (first field can go anywhere)
    expect(dennis.canPlowField(2, 2)).toBe(true)
  })

  test('blocks stable building on adjacent empty spaces', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // (0,1) is adjacent to room — restricted
    expect(dennis.canBuildStable(0, 1)).toBe(false)
    // (2,4) is not adjacent to any room — allowed
    expect(dennis.canBuildStable(2, 4)).toBe(true)
  })

  test('restriction lifts when all non-adjacent spaces are used', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          // Fill all non-adjacent spaces with fields and stables
          // Non-adjacent empty spaces: (0,2)-(0,4), (1,2)-(1,4), (2,1)-(2,4)
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // All non-adjacent spaces are used → restriction lifted
    // (0,1) is adjacent to room but now allowed
    expect(dennis.canBuildRoom(0, 1)).toBe(true)
    expect(dennis.canPlowField(2, 0)).toBe(true)
    expect(dennis.canBuildStable(1, 1)).toBe(true)
  })

  test('no restriction without the card', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Without card, all adjacent spaces are available
    expect(dennis.canBuildRoom(0, 1)).toBe(true)
    expect(dennis.canBuildRoom(1, 1)).toBe(true)
    expect(dennis.canPlowField(0, 1)).toBe(true)
    expect(dennis.canBuildStable(2, 0)).toBe(true)
  })

  test('pasture validation rejects restricted spaces', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Try to fence (0,1) which is adjacent to room — restricted
    const result = dennis.validatePastureSelection([{ row: 0, col: 1 }])
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Future Building Site')

    // Fence (2,2) which is not adjacent — allowed (assuming enough wood)
    const result2 = dennis.validatePastureSelection([{ row: 2, col: 2 }])
    // Should pass space restriction check (may fail on wood cost, that's fine)
    expect(result2.error).not.toContain('Future Building Site')
  })
})
