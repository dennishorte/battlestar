const t = require('../../../testutil_v2.js')

describe('Millwright', () => {
  test('gives 1 grain when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['millwright-d088'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Millwright')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['millwright-d088'],
      },
    })
  })

  test('grain substitution when building a wood room — only sub option affordable', () => {
    // Wood room costs 5 wood + 2 reed. With Millwright, can replace up to 2 wood with grain.
    // Give player 3 wood + 2 grain + 2 reed — can only afford the 2-grain-sub option (3 wood, 2 grain, 2 reed)
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 3,
        grain: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Only 1 affordable option (3 wood, 2 reed, 2 grain) — auto-selected

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution when building room — choice between standard and sub', () => {
    // Wood room costs 5 wood + 2 reed. Player has enough for both standard and sub.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 5,
        grain: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Choose the grain substitution option (replace 2 wood with 2 grain)
    t.choose(game, '3 wood, 2 reed, 2 grain')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 2,
        grain: 0,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution when building room — choose standard cost', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 5,
        grain: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Choose the standard cost
    t.choose(game, '5 wood, 2 reed')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 2,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution when renovating (wood to clay)', () => {
    // Renovation wood→clay costs 2 clay + 1 reed (2 rooms * 1 clay per room + 1 reed).
    // With Millwright, can replace up to 2 clay with grain.
    // Give only grain (no clay) so only grain-sub option is affordable.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        clay: 0,
        grain: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Only 1 affordable renovation option (2 grain, 1 reed) — auto-selected
    // Major improvement is auto-skipped (no resources to afford any)

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        clay: 0,
        grain: 0,
        reed: 0,
        roomType: 'clay',
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution when building a stable', () => {
    // Stable costs 2 wood. With Millwright, can replace up to 2 wood with grain.
    // Give 0 wood, 2 grain — only the 2-grain option is affordable.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 0,
        grain: 2,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    // Only 1 affordable stable cost option (2 grain) — auto-selected
    t.choose(game, '0,1')
    // After building stable, no more resources — loop auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          stables: [{ row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution when building fences', () => {
    // Fences cost 1 wood each. Build a 1-space pasture needing 4 fences.
    // With 2 wood + 2 grain, can afford via substitution.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      dennis: {
        occupations: ['millwright-d088'],
        wood: 2,
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    // Build a 1-space pasture at (0,4) — needs 4 fences
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // Should get cost choice: 4 wood (not affordable), 3 wood + 1 grain (not affordable),
    // 2 wood + 2 grain (affordable) — only 1 affordable option, auto-selected
    // After paying, no resources left — loop auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fences: 4,
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('no grain substitution offered when player has no grain', () => {
    // Wood room costs 5 wood + 2 reed. Player has no grain — only standard cost.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 5,
        grain: 0,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Only standard cost is affordable (no grain for substitution) — auto-selected

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution with 1 grain replaces exactly 1 building resource', () => {
    // Only 1 grain available — can only substitute 1 resource.
    // 4 wood + 1 grain + 2 reed: can afford "4 wood, 2 reed, 1 grain" (auto-selected since standard needs 5 wood)
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 4,
        grain: 1,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Only the 1-sub option (4 wood, 2 reed, 1 grain) is affordable — auto-selected

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        reed: 0,
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('stable can be built with only grain when Millwright is active', () => {
    // Stable costs 2 wood. With 0 wood and 2 grain, should be able to build.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'wood',
        wood: 0,
        grain: 2,
      },
    })
    game.run()

    // Should see Build Stable as an option (canAffordStable with grain sub)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.choose(game, '0,1')
    // After building stable, no more resources — loop auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 0,
        grain: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          stables: [{ row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('grain substitution for clay room cost', () => {
    // Clay room costs 5 clay + 2 reed. With Millwright, can replace up to 2 clay with grain.
    // Give 3 clay + 2 grain + 2 reed — only the 2-sub option is affordable.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['millwright-d088'],
        roomType: 'clay',
        clay: 3,
        grain: 2,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Only 1 affordable: 3 clay, 2 reed, 2 grain (standard needs 5 clay)

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        clay: 0,
        grain: 0,
        reed: 0,
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('fences with grain substitution choice when multiple options affordable', () => {
    // Build a 2-space pasture needing 6 fences. With 6 wood + 2 grain, multiple options.
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      dennis: {
        occupations: ['millwright-d088'],
        wood: 6,
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] })
    // 6 fences needed. Multiple options affordable — choose 4 wood, 2 grain
    t.choose(game, '4 wood, 2 grain')
    t.choose(game, 'Done building fences')

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['millwright-d088'],
        wood: 2,
        grain: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          fences: 6,
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
        score: dennis.calculateScore(),
      },
    })
  })
})
