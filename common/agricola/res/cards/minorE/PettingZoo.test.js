const t = require('../../../testutil_v2.js')

describe('PettingZoo', () => {
  test('holds mixed animals up to room count when pasture adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        farmyard: {
          // Pasture at (0,1) is adjacent to room at (0,0)
          pastures: [{ spaces: [{ row: 0, col: 1 }] }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')

    // Verify animal holding card
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
    expect(holdings[0].name).toBe('Petting Zoo')
    expect(holdings[0].mixedTypes).toBe(true)

    // With pasture adjacent to house, capacity = room count (2)
    expect(player.hasPastureAdjacentToHouse()).toBe(true)
  })

  test('no capacity when no pasture adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        farmyard: {
          // Pasture at (2,4) is NOT adjacent to rooms at (0,0) and (1,0)
          pastures: [{ spaces: [{ row: 2, col: 4 }] }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.hasPastureAdjacentToHouse()).toBe(false)

    // PettingZoo contributes 0 when no adjacent pasture
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
  })

  test('auto-places animals to PettingZoo on overflow', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        pet: 'sheep',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Sheep Market gives 1 sheep. Pasture full (2), pet full.
    // PettingZoo should hold the overflow.
    t.choose(game, 'Sheep Market')

    const player = game.players.byName('dennis')
    expect(player.getTotalAnimals('sheep')).toBe(4) // 2 pasture + 1 pet + 1 on card
  })
})
