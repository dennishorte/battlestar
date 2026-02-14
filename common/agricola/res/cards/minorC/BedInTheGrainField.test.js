const t = require('../../../testutil_v2.js')

describe('Bed in the Grain Field', () => {
  test('triggers family growth at harvest when flag is set', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        minorImprovements: ['bed-in-the-grain-field-c024'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3rd room for newborn
          fields: [{ row: 2, col: 1, crop: 'grain', cropCount: 1 }], // prereq: grain field
        },
      },
      micah: { food: 20 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.bedInGrainFieldNextHarvest = true
    })
    game.run()

    // Round 4: 4 actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // Harvest: onHarvestStart fires → family growth
    const dennis = game.players.byName('dennis')
    expect(dennis.familyMembers).toBe(3) // 2 + 1 from family growth
  })

  test('does not trigger family growth without spare room', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        minorImprovements: ['bed-in-the-grain-field-c024'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }], // prereq: grain field
          // No extra room — 2 rooms, 2 family members → no spare
        },
      },
      micah: { food: 20 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.bedInGrainFieldNextHarvest = true
    })
    game.run()

    // Round 4: 4 actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // Harvest: flag set, but no room → no family growth
    const dennis = game.players.byName('dennis')
    expect(dennis.familyMembers).toBe(2) // No change
    expect(dennis.bedInGrainFieldNextHarvest).toBeUndefined() // Flag cleared
  })

  test('onPlay sets the harvest flag', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bed-in-the-grain-field-c024'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }], // prereq: grain field
        },
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Bed in the Grain Field')

    const dennis = game.players.byName('dennis')
    expect(dennis.bedInGrainFieldNextHarvest).toBe(true)
  })
})
