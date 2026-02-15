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

    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('wood-field')
    expect(vf.crop).toBe('wood')
    expect(vf.cropCount).toBe(2)
    expect(dennis.wood).toBe(1) // 2 - 1 used for sowing
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

    const dennis = game.players.byName('dennis')
    // Virtual field should exist (set via setBoard)
    expect(dennis.virtualFields).toHaveLength(1)
    expect(dennis.virtualFields[0].cropRestriction).toBe('wood')

    // Cannot sow grain
    expect(dennis.canSowVirtualField('wood-field', 'grain')).toBe(false)
    // Cannot sow vegetables
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

    // Harvest: field phase harvests 1 wood, feeding phase auto-resolves (have enough food)
    // No baking prompt since no baking improvement

    const dennis = game.players.byName('dennis')
    expect(dennis.getVirtualField('wood-field').cropCount).toBe(1)
    expect(dennis.wood).toBeGreaterThanOrEqual(1) // at least 1 from harvest
  })

  test('counts as field for scoring', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['wood-field-d075'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('wood-field')
    expect(vf.countsAsFieldForScoring).toBe(true)
  })
})
