const t = require('../../../testutil_v2.js')

describe('Rock Garden', () => {
  test('creates 3 virtual fields for stone', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    for (let i = 1; i <= 3; i++) {
      const vf = dennis.getVirtualField(`rock-garden-e080-${i}`)
      expect(vf).toBeTruthy()
      expect(vf.cropRestriction).toBe('stone')
      expect(vf.label).toBe(`Rock Garden ${i}`)
    }
  })

  test('sows stone into individual sub-fields', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        stone: 2,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // Sow stone into two of the three sub-fields
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'rock-garden-e080-1', cropType: 'stone' })
    t.action(game, 'sow-virtual-field', { fieldId: 'rock-garden-e080-2', cropType: 'stone' })

    const dennis = game.players.byName('dennis')
    const vf1 = dennis.getVirtualField('rock-garden-e080-1')
    const vf2 = dennis.getVirtualField('rock-garden-e080-2')
    const vf3 = dennis.getVirtualField('rock-garden-e080-3')
    expect(vf1.crop).toBe('stone')
    expect(vf1.cropCount).toBe(2) // vegetable sowing amount
    expect(vf2.crop).toBe('stone')
    expect(vf2.cropCount).toBe(2)
    expect(vf3.crop).toBeNull() // not sown
    expect(dennis.stone).toBe(0)
  })

  test('can sow with only 1 stone', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        stone: 1,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'rock-garden-e080-1', cropType: 'stone' })

    const dennis = game.players.byName('dennis')
    const vf1 = dennis.getVirtualField('rock-garden-e080-1')
    expect(vf1.crop).toBe('stone')
    expect(vf1.cropCount).toBe(2)
    expect(dennis.stone).toBe(0)
  })

  test('harvests 3 stone when all 3 sub-fields are sown', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        virtualFields: {
          'rock-garden-e080-1': { crop: 'stone', cropCount: 2 },
          'rock-garden-e080-2': { crop: 'stone', cropCount: 2 },
          'rock-garden-e080-3': { crop: 'stone', cropCount: 2 },
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to complete the round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 stone from each sub-field = 3 stone
    t.testBoard(game, {
      dennis: {
        stone: 3,  // 1 from each sub-field
        grain: 1,  // from Grain Seeds
        food: 8,   // 10 + 2(DL) - 4(feed)
        minorImprovements: ['rock-garden-e080'],
      },
    })

    // Each sub-field should have 1 remaining
    const dennis = game.players.byName('dennis')
    for (let i = 1; i <= 3; i++) {
      const vf = dennis.getVirtualField(`rock-garden-e080-${i}`)
      expect(vf.crop).toBe('stone')
      expect(vf.cropCount).toBe(1)
    }
  })

  test('counts as 1 field for prerequisites despite 3 virtual fields', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 0 grid fields + 1 from Rock Garden card (isField: true)
    expect(dennis.getFieldCountForPrereqs()).toBe(1)
  })

  test('counts as 1 field for scoring even with all 3 sub-fields sown', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        virtualFields: {
          'rock-garden-e080-1': { crop: 'stone', cropCount: 2 },
          'rock-garden-e080-2': { crop: 'stone', cropCount: 2 },
          'rock-garden-e080-3': { crop: 'stone', cropCount: 2 },
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getFieldCount()).toBe(1)
  })

  test('counts as 1 field for scoring even when no sub-fields are sown', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getFieldCount()).toBe(1)
  })

  test('harvests only from sown sub-fields', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        virtualFields: {
          'rock-garden-e080-1': { crop: 'stone', cropCount: 2 },
          // sub-fields 2 and 3 are empty
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        stone: 1,  // only 1 sub-field was sown
        grain: 1,
        food: 8,
        minorImprovements: ['rock-garden-e080'],
      },
    })
  })
})
