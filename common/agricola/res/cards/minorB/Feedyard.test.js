const t = require('../../../testutil_v2.js')

describe('Feedyard', () => {
  test('auto-places overflow animals to Feedyard card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Pasture holds 2, pet slot full. Sheep Market gives 1 sheep.
    // Feedyard capacity = 1 pasture = 1 spot. Overflow goes to Feedyard.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 }, // 2 in pasture + 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })

    // Verify the animal is tracked on the card
    const player = game.players.byName('dennis')
    expect(player.getCardAnimalTotal('feedyard-b011')).toBe(1)
    expect(player.getCardAnimals('feedyard-b011').sheep).toBe(1)
  })

  test('food from unused spots after breeding phase', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 3 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions (2 workers each)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase (grain harvested)
    // Feeding: -4 food
    // Breeding: sheep 2→3 (baby auto-placed in pasture since there's room)
    // After breeding: Feedyard capacity = 2 pastures, 0 animals on card → 2 unused → +2 food
    t.testBoard(game, {
      dennis: {
        // 10 + 2(DL) + 2(Feedyard) - 4(feed) = 10
        food: 10,
        grain: 1,
        animals: { sheep: 3 },
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 3 },
            { spaces: [{ row: 0, col: 3 }] },
          ],
        },
      },
    })
  })

  test('capacity tracks pasture count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }] },
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 0, col: 3 }] },
          ],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
    expect(holdings[0].name).toBe('Feedyard')
    expect(holdings[0].capacity).toBe(3)
    expect(holdings[0].mixedTypes).toBe(true)
  })

  test('appears in animal placement locations', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }] }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const locations = player.getAnimalPlacementLocations()
    const cardLoc = locations.find(l => l.type === 'card')
    expect(cardLoc).toBeDefined()
    expect(cardLoc.id).toBe('card-feedyard-b011')
    expect(cardLoc.name).toBe('Feedyard')
    expect(cardLoc.mixedTypes).toBe(true)
    expect(cardLoc.maxCapacity).toBe(1) // 1 pasture = capacity 1
  })

  test('holds mixed animal types', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 },
            { spaces: [{ row: 0, col: 3 }], boar: 1 },
          ],
        },
        pet: 'cattle',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Feedyard capacity = 2 pastures. Manually add mixed types.
    player.addCardAnimal('feedyard-b011', 'sheep', 1)
    player.addCardAnimal('feedyard-b011', 'boar', 1)

    expect(player.getCardAnimalTotal('feedyard-b011')).toBe(2)
    expect(player.getCardAnimals('feedyard-b011').sheep).toBe(1)
    expect(player.getCardAnimals('feedyard-b011').boar).toBe(1)

    // Mixed types reflected in total counts
    expect(player.getTotalAnimals('sheep')).toBe(5)  // 4 pasture + 1 card
    expect(player.getTotalAnimals('boar')).toBe(2)   // 1 pasture + 1 card
    expect(player.getTotalAnimals('cattle')).toBe(1)  // 1 pet
  })
})
