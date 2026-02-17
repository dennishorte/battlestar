const t = require('../../../testutil_v2.js')

describe('PetGrower', () => {
  test('gives 1 sheep when house is empty after taking animals from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pet-grower-d164'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.state.actionSpaces['take-sheep'].accumulated = 3
    })
    game.run()

    // Dennis takes Sheep Market: 3 sheep, modal shows because of forceManualAnimalPlacement
    t.choose(game, 'Sheep Market')
    // Place all 3 sheep in pasture (leaving house empty)
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'pasture-0', animalType: 'sheep', count: 3 }],
      overflow: {},
    })

    // House is empty → PetGrower gives +1 sheep (auto-placed into pasture)
    t.testBoard(game, {
      dennis: {
        occupations: ['pet-grower-d164'],
        animals: { sheep: 4 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 }],
        },
      },
    })
  })

  test('no bonus sheep when player places animal in house', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pet-grower-d164'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.state.actionSpaces['take-sheep'].accumulated = 3
    })
    game.run()

    // Dennis takes Sheep Market: 3 sheep, modal shows
    t.choose(game, 'Sheep Market')
    // Place 1 sheep in house and 2 in pasture
    t.action(game, 'animal-placement', {
      placements: [
        { locationId: 'house', animalType: 'sheep', count: 1 },
        { locationId: 'pasture-0', animalType: 'sheep', count: 2 },
      ],
      overflow: {},
    })

    // House has a sheep → no PetGrower bonus
    t.testBoard(game, {
      dennis: {
        occupations: ['pet-grower-d164'],
        pet: 'sheep',
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
    })
  })

  test('does not trigger on non-animal accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pet-grower-d164'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }] }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis takes wood (non-animal accumulation) — no PetGrower trigger
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['pet-grower-d164'],
        wood: 3,
        animals: { sheep: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }] }],
        },
      },
    })
  })
})
