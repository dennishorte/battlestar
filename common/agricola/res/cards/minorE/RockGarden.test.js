const t = require('../../../testutil_v2.js')

describe('Rock Garden', () => {
  test('sows stone with amount 6 (counts as 3 fields)', () => {
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

    // Sow stone into Rock Garden virtual field
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'rock-garden-e080', cropType: 'stone' })

    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('rock-garden-e080')
    expect(vf.crop).toBe('stone')
    expect(vf.cropCount).toBe(6) // custom sowingAmount
    expect(dennis.stone).toBe(0)
  })

  test('harvests 1 stone per harvest round', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rock-garden-e080'],
        virtualFields: {
          'rock-garden-e080': { crop: 'stone', cropCount: 6 },
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

    // Harvest: field phase harvests 1 stone from Rock Garden
    // Feeding: -4 food (2 workers × 2)
    t.testBoard(game, {
      dennis: {
        stone: 1,  // harvested from Rock Garden
        grain: 1,  // from Grain Seeds
        food: 8,   // 10 + 2(DL) - 4(feed)
        minorImprovements: ['rock-garden-e080'],
      },
    })

    // Verify virtual field still has 5 remaining
    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('rock-garden-e080')
    expect(vf.crop).toBe('stone')
    expect(vf.cropCount).toBe(5)
  })
})
