const t = require('../../../testutil_v2.js')

describe('Wood Field', () => {
  test('on play, creates two wood-only virtual fields', () => {
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

    // Dennis turn 2: sow wood on first Wood Field via Grain Utilization
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'wood-field-d075-1', cropType: 'wood' })

    // Micah turn 2
    t.choose(game, 'Forest')

    // Each Wood Field can be sown independently; sowing once costs 1 wood and
    // places 3 wood (wood is sown as grain). The second field is still empty.
    const dennis = game.players.byName('dennis')
    const vf1 = dennis.getVirtualField('wood-field-d075-1')
    const vf2 = dennis.getVirtualField('wood-field-d075-2')
    expect(vf1.crop).toBe('wood')
    expect(vf1.cropCount).toBe(3)
    expect(vf2.crop).toBe(null)
    expect(vf2.cropCount).toBe(0)

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        wood: 1, // 2 - 1 used for sowing one field
        food: 1, // 1 card cost - 1 food cost + 1 Meeting Place food = 1
      },
    })
  })

  test('cannot sow grain or vegetables on wood fields', () => {
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

    const dennis = game.players.byName('dennis')
    expect(dennis.virtualFields).toHaveLength(2)
    expect(dennis.virtualFields.every(vf => vf.cropRestriction === 'wood')).toBe(true)

    expect(dennis.canSowVirtualField('wood-field-d075-1', 'grain')).toBe(false)
    expect(dennis.canSowVirtualField('wood-field-d075-1', 'vegetables')).toBe(false)
    expect(dennis.canSowVirtualField('wood-field-d075-2', 'grain')).toBe(false)
    expect(dennis.canSowVirtualField('wood-field-d075-2', 'vegetables')).toBe(false)
  })

  test('harvest returns 1 wood per sown sub-field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        virtualFields: {
          'wood-field-d075-1': { crop: 'wood', cropCount: 3 },
          'wood-field-d075-2': { crop: 'wood', cropCount: 3 },
        },
        food: 10, // enough to feed
      },
    })
    game.run()

    // Play through round 4 actions (4 turns)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Fishing')

    // Harvest: each sown wood field yields 1 wood
    const dennis = game.players.byName('dennis')
    expect(dennis.getVirtualField('wood-field-d075-1').cropCount).toBe(2)
    expect(dennis.getVirtualField('wood-field-d075-2').cropCount).toBe(2)

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        wood: 2, // 1 from each sown sub-field
        food: 8, // 10 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // from Clay Pit
      },
    })
  })

  test('counts as 1 field for scoring even when both sub-fields are empty', () => {
    // Both sub-fields share the scoring group 'wood-field-d075', so the
    // card always contributes exactly 1 field to scoring regardless of sowing.
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    // Play through round 1
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // fields=2 (+1 from real field + Wood Field scoring group), pastures=0 (-1),
    // grain=1 (+1), veg=0 (-1), sheep/boar/cattle=0 (-1 each), rooms=2 wood (0),
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
