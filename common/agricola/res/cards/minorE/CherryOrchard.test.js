const t = require('../../../testutil_v2.js')

describe('Cherry Orchard', () => {
  test('sows wood as grain (3 crops)', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cherry-orchard-e068'],
        wood: 1,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // Sow wood into Cherry Orchard virtual field
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-virtual-field', { fieldId: 'cherry-orchard-e068', cropType: 'wood' })

    const dennis = game.players.byName('dennis')
    const vf = dennis.getVirtualField('cherry-orchard-e068')
    expect(vf.crop).toBe('wood')
    expect(vf.cropCount).toBe(3) // wood sows like grain
    expect(dennis.wood).toBe(0)
  })

  test('gives 1 vegetable when last wood harvested', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cherry-orchard-e068'],
        virtualFields: {
          'cherry-orchard-e068': { crop: 'wood', cropCount: 1 },
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

    // Harvest: field phase harvests 1 wood from Cherry Orchard (last → +1 vegetable)
    // Feeding: -4 food (2 workers × 2)
    t.testBoard(game, {
      dennis: {
        wood: 1,        // harvested from Cherry Orchard
        vegetables: 1,  // onHarvestLast bonus
        grain: 1,       // from Grain Seeds
        food: 8,        // 10 + 2(DL) - 4(feed)
        minorImprovements: ['cherry-orchard-e068'],
      },
    })
  })
})
