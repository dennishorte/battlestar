const t = require('../../../testutil_v2.js')

describe('Love for Agriculture', () => {
  test('sow grain into 1-space pasture virtual field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        grain: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // Virtual field should exist from sync during setBoard
    let dennis = game.players.byName('dennis')
    expect(dennis.virtualFields).toHaveLength(1)
    expect(dennis.virtualFields[0].pastureSpaces).toBe('0,2')

    // Sow grain into the pasture virtual field
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'love-pasture-0,2', cropType: 'grain' })

    dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('love-pasture-0,2')
    expect(vf.crop).toBe('grain')
    expect(vf.cropCount).toBe(3)
  })

  test('sow vegetables into 2-space pasture virtual field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        vegetables: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    const key = '0,2|0,3'
    let dennis = game.players.byName('dennis')
    expect(dennis.virtualFields).toHaveLength(1)
    expect(dennis.virtualFields[0].pastureSpaces).toBe(key)

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: `love-pasture-${key}`, cropType: 'vegetables' })

    dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField(`love-pasture-${key}`)
    expect(vf.crop).toBe('vegetables')
    expect(vf.cropCount).toBe(2)
  })

  test('capacity reduction while sown', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        grain: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    let dennis = game.players.byName('dennis')

    // Before sowing: 1-space pasture has capacity 2, 2-space has capacity 4
    let pasture1 = dennis.farmyard.pastures.find(p => p.spaces.length === 1)
    let pasture2 = dennis.farmyard.pastures.find(p => p.spaces.length === 2)
    expect(dennis.getPastureCapacity(pasture1)).toBe(2)
    expect(dennis.getPastureCapacity(pasture2)).toBe(4)

    // Sow grain into the 1-space pasture
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'love-pasture-0,2', cropType: 'grain' })

    // Re-obtain references after game replay
    dennis = game.players.byName('dennis')
    pasture1 = dennis.farmyard.pastures.find(p => p.spaces.length === 1)
    pasture2 = dennis.farmyard.pastures.find(p => p.spaces.length === 2)

    // After sowing: 1-space pasture capacity reduced by 1 (= 1), 2-space unchanged
    expect(dennis.getPastureCapacity(pasture1)).toBe(1)
    expect(dennis.getPastureCapacity(pasture2)).toBe(4)
  })

  test('harvest from sown pasture virtual field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      // 3 stage-1 round cards → orderedCards.length = 3, mainLoop plays round 4 (first harvest)
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        grain: 1,
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 4: sow grain then complete work phase, then harvest
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'love-pasture-0,2', cropType: 'grain' })
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: virtual field grain 3 → 2, player gets 1 grain
    // Feeding: 4 food consumed (2 workers × 2)
    t.testBoard(game, {
      dennis: {
        food: 8, // 10 + 2(DL) - 4(feed)
        grain: 1, // 0 + 1(harvest from virtual field)
        minorImprovements: ['love-for-agriculture-b072'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
    })

    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('love-pasture-0,2')
    expect(vf.crop).toBe('grain')
    expect(vf.cropCount).toBe(2)
  })

  test('sown pasture counts as field for scoring, pasture count unchanged', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        grain: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    let dennis = game.players.byName('dennis')

    // Before sowing: 0 fields, 1 pasture
    expect(dennis.getFieldCount()).toBe(0)
    expect(dennis.getPastureCount()).toBe(1)

    // Sow grain into the pasture virtual field
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'love-pasture-0,2', cropType: 'grain' })

    // Re-obtain after replay
    dennis = game.players.byName('dennis')

    // After sowing: 1 field (from virtual field), still 1 pasture
    expect(dennis.getFieldCount()).toBe(1)
    expect(dennis.getPastureCount()).toBe(1)
  })

  test('3-space pasture has no virtual field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.virtualFields.filter(vf => vf.cardId === 'love-for-agriculture-b072')).toHaveLength(0)
  })

  test('new pasture gets virtual field after building fences', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['love-for-agriculture-b072'],
        wood: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    let dennis = game.players.byName('dennis')
    // Start with 1 virtual field for the existing pasture
    expect(dennis.virtualFields.filter(vf => vf.cardId === 'love-for-agriculture-b072')).toHaveLength(1)

    // Build another 1-space pasture at (0,3) adjacent to existing (0,2)
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 3 }] })
    t.action(game, 'done-building-pastures')

    // Re-obtain after replay
    dennis = game.players.byName('dennis')

    // Now should have 2 virtual fields (one for each 1-space pasture)
    const loveVFs = dennis.virtualFields.filter(vf => vf.cardId === 'love-for-agriculture-b072')
    expect(loveVFs).toHaveLength(2)
    expect(dennis.getVirtualField('love-pasture-0,3')).toBeTruthy()
  })
})
