const t = require('../../../testutil_v2.js')

describe('Future Building Site', () => {
  test('blocks room building when non-adjacent empty spaces exist', () => {
    // Grid (3x5): rooms at (0,0) and (1,0)
    // Adjacent to house: (0,1), (1,1), (2,0)
    // Non-adjacent: (0,2)-(0,4), (1,2)-(1,4), (2,1)-(2,4)
    // All valid room build spots are adjacent to house → all blocked
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        wood: 10,
        reed: 4,
      },
      actionSpaces: ['Farm Expansion'],
    })
    game.run()

    // Farm Expansion: all room-adjacent spaces are blocked by FBS.
    // Only stable building should be possible (non-adjacent spaces).
    t.choose(game, 'Farm Expansion')
    const choices = t.currentChoices(game)
    // Build Room should NOT appear (all valid room spaces are adjacent to house → restricted)
    expect(choices).not.toContain('Build Room')
    // Build Stable should appear (can build on non-adjacent spaces)
    expect(choices).toContain('Build Stable')

    // Build a stable on a non-adjacent space to verify
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 4 })

    t.testBoard(game, {
      dennis: {
        wood: 8, // 10 - 2 (stable cost)
        reed: 4,
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          stables: [{ row: 2, col: 4 }],
        },
      },
    })
  })

  test('blocks plowing on adjacent spaces but allows non-adjacent', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
      },
      actionSpaces: ['Farmland'],
    })
    game.run()

    t.choose(game, 'Farmland')
    const choices = t.currentChoices(game)
    // (0,1), (1,1), (2,0) are adjacent to house → blocked
    expect(choices).not.toContain('0,1')
    expect(choices).not.toContain('1,1')
    expect(choices).not.toContain('2,0')
    // (2,2) is not adjacent → allowed
    expect(choices).toContain('2,2')

    // Plow a non-adjacent field
    t.choose(game, '2,2')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          fields: [{ row: 2, col: 2 }],
        },
      },
    })
  })

  test('blocks stable building on adjacent empty spaces', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        wood: 4,
      },
      actionSpaces: ['Farm Expansion'],
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')

    // Now at stable placement. Check available spaces via currentChoices.
    const choices = t.currentChoices(game)
    // (0,1), (1,1), (2,0) are adjacent to house → blocked for stable
    expect(choices).not.toContain('0,1')
    expect(choices).not.toContain('1,1')
    expect(choices).not.toContain('2,0')
    // (2,4) is non-adjacent → allowed
    expect(choices).toContain('2,4')

    t.action(game, 'build-stable', { row: 2, col: 4 })

    t.testBoard(game, {
      dennis: {
        wood: 2, // 4 - 2 (stable cost)
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          stables: [{ row: 2, col: 4 }],
        },
      },
    })
  })

  test('restriction lifts when all non-adjacent spaces are used', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        wood: 10,
        reed: 4,
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
      actionSpaces: ['Farm Expansion'],
    })
    game.run()

    // All non-adjacent spaces are used → restriction lifted.
    // Room building should now be available on adjacent spaces.
    t.choose(game, 'Farm Expansion')
    const choices = t.currentChoices(game)
    expect(choices).toContain('Build Room')

    // Build room at (0,1) which was previously restricted
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        wood: 5,  // 10 - 5 (room cost)
        reed: 2,  // 4 - 2 (room cost)
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
  })

  test('no restriction without the card', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
    })
    game.run()

    // Without FutureBuildingSite, all spaces including adjacent ones are available
    t.choose(game, 'Farmland')
    const choices = t.currentChoices(game)
    // (0,1) is adjacent to house — should be allowed without the card
    expect(choices).toContain('0,1')
    // (2,0) is adjacent to house — should be allowed
    expect(choices).toContain('2,0')

    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        farmyard: {
          fields: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('pasture building on non-adjacent spaces succeeds', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['future-building-site-b038'],
        wood: 15,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    // Fence a non-adjacent space → should succeed
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        wood: 11, // 15 - 4 (fences for single-space pasture)
        minorImprovements: ['future-building-site-b038'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 2 }] }],
        },
      },
    })
  })
})
