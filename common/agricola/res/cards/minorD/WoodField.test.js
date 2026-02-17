const t = require('../../../testutil_v2.js')

describe('Wood Field', () => {
  test('on play, creates virtual field that can be sown with wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-field-d075'],
        occupations: ['test-occupation-1'],
        food: 1, // card cost
        wood: 2,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // Dennis turn 1: play Wood Field via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wood Field')

    // Micah turn 1
    t.choose(game, 'Day Laborer')

    // Dennis turn 2: sow wood via Grain Utilization
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'wood-field', cropType: 'wood' })

    // Micah turn 2
    t.choose(game, 'Forest')

    // Virtual field state has no testBoard equivalent — check directly
    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('wood-field')
    expect(vf.crop).toBe('wood')
    expect(vf.cropCount).toBe(2)

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        wood: 1, // 2 - 1 used for sowing
        food: 1, // 1 card cost - 1 food cost + 1 Meeting Place food = 1
      },
    })
  })

  test('cannot sow grain or vegetables on wood field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        grain: 2,
        vegetables: 1,
      },
    })
    game.run()

    // Virtual field crop restriction has no testBoard equivalent — check directly
    const dennis = game.players.byName('dennis')
    expect(dennis.virtualFields).toHaveLength(1)
    expect(dennis.virtualFields[0].cropRestriction).toBe('wood')

    // Cannot sow grain or vegetables (no testBoard equivalent for virtual field restriction)
    expect(dennis.canSowVirtualField('wood-field', 'grain')).toBe(false)
    expect(dennis.canSowVirtualField('wood-field', 'vegetables')).toBe(false)
  })

  test('harvest returns wood to player', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        virtualFields: {
          'wood-field': { crop: 'wood', cropCount: 2 },
        },
        food: 10, // enough to feed
      },
    })
    game.run()

    // Play through round 4 actions (4 turns needed)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Fishing')

    // Harvest: field phase harvests 1 wood, feeding phase auto-resolves

    // Virtual field cropCount has no testBoard equivalent — check directly
    const dennis = game.players.byName('dennis')
    expect(dennis.getVirtualField('wood-field').cropCount).toBe(1)

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        wood: 1, // 1 from harvest
        food: 8, // 10 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // from Clay Pit
      },
    })
  })

  test('counts as field for scoring when sown', () => {
    // Wood Field's virtual field countsAsFieldForScoring, but only when sown
    // With 1 real field + 1 sown virtual = 2 fields (+1) vs 1 field (-1) = +2 difference
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        virtualFields: {
          'wood-field': { crop: 'wood', cropCount: 1 },
        },
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    // Play through round 1
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // fields=2 (+1), pastures=0 (-1), grain=1 (+1), veg=0 (-1),
    // sheep=0 (-1), boar=0 (-1), cattle=0 (-1), rooms=2 wood (0),
    // family=2 (6), unused=12 (-12), bonusPoints=1 (vps)
    // Total = 1 + (-1) + 1 + (-1) + (-1) + (-1) + (-1) + 0 + 6 + (-12) + 0 + 1 = -8
    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        food: 2, // Day Laborer
        grain: 1, // Grain Seeds
        score: -8,
      },
    })
  })
})
