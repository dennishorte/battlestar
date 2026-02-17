const t = require('../../../testutil_v2.js')

describe('WildlifeReserve', () => {
  test('holds overflow sheep from Sheep Market', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // Pet is full. No pastures. Wildlife Reserve can hold 1 sheep.
    // Sheep Market gives 1 sheep → overflow to card.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2 }, // 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('per-type limit prevents second sheep on card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
    })
    game.run()

    // Pet full. Sheep Market gives 2 sheep. Card has per-type limit of 1 sheep.
    // 1st sheep → card. 2nd sheep → no room (pet full, no pastures, card sheep limit 1).
    // Overflow triggers animal placement modal → player must release/cook the extra.
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'wildlife-reserve-c011', animalType: 'sheep', count: 1 }],
      overflow: { release: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2 }, // 1 pet + 1 on card (1 released)
        pet: 'sheep',
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('holds mixed animal types simultaneously via multiple market rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // Sheep Market: 1 sheep → pet full, overflow to card
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2 }, // 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('holds boar overflow from Pig Market', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        pet: 'boar',
      },
      actionSpaces: [{ ref: 'Pig Market', accumulated: 1 }],
    })
    game.run()

    // Pet full. Pig Market gives 1 boar → overflow to card (card holds 1 boar).
    t.choose(game, 'Pig Market')

    t.testBoard(game, {
      dennis: {
        animals: { boar: 2 }, // 1 pet + 1 on card
        pet: 'boar',
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })
})
