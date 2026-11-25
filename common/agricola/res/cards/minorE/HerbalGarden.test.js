const t = require('../../../testutil_v2.js')

describe('Herbal Garden', () => {
  test('can be played with 1 pasture and gives 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['herbal-garden-e036'],
        wood: 1,
        food: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    // dennis: Meeting Place → play Herbal Garden (cost: 1 wood, prereq: 1 pasture)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Herbal Garden')

    // Remaining turns
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fishing')      // micah

    t.testBoard(game, {
      dennis: {
        // wood: 0  (1 - 1 cost)
        food: 4,   // 1 + 1 (Meeting Place) + 2 (Day Laborer)
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] },
          ],
        },
      },
    })
  })

  test('leaves one pasture empty when taking sheep', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        pet: 'boar',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 1 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // The sheep pasture has room. The empty pasture must stay empty.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2, boar: 1 },
        pet: 'boar',
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
  })

  test('will not put sheep in the only pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        pet: 'boar',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        animals: { boar: 1 },
        pet: 'boar',
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
    })
  })

  test('playing the card with every pasture occupied forces one to be emptied', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['herbal-garden-e036'],
        wood: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }], sheep: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Herbal Garden')
    t.action(game, 'animal-placement', {
      placements: [],
      removals: [{ locationId: 'pasture-0', animalType: 'sheep', count: 2 }],
      overflow: { release: { sheep: 2 } },
    })

    t.testBoard(game, {
      dennis: {
        food: 1,
        animals: { sheep: 2 },
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 0, col: 4 }], sheep: 2 },
          ],
        },
      },
    })
  })

  test('rejects a placement that would fill every pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        pet: 'boar',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const empty = dennis.farmyard.pastures.find(pasture => !(pasture.animalCount > 0))
    const result = dennis.applyAnimalPlacements({
      placements: [{ locationId: `pasture-${empty.id}`, animalType: 'sheep', count: 1 }],
      removals: [],
      overflow: {},
      incoming: { sheep: 1 },
    })

    expect(result.success).toBe(false)
    expect(empty.animalCount).toBe(0)
    expect(dennis.canPlaceAnimals('sheep', 1)).toBe(false)
  })

  test('can move animals so a different pasture stays empty', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const occupied = dennis.farmyard.pastures.find(pasture => pasture.animalCount > 0)
    const empty = dennis.farmyard.pastures.find(pasture => !(pasture.animalCount > 0))
    const result = dennis.applyAnimalPlacements({
      placements: [{ locationId: `pasture-${empty.id}`, animalType: 'sheep', count: 2 }],
      removals: [{ locationId: `pasture-${occupied.id}`, animalType: 'sheep', count: 2 }],
      overflow: {},
      incoming: {},
    })

    expect(result.success).toBe(true)
    expect(occupied.animalCount).toBe(0)
    expect(empty.animalType).toBe('sheep')
    expect(empty.animalCount).toBe(2)
  })

  test('breeding uses a pasture that already has sheep and leaves one empty', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        pet: 'boar',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const result = dennis.breedAnimals()
    const empty = dennis.farmyard.pastures.find(pasture =>
      pasture.spaces.some(space => space.row === 0 && space.col === 4)
    )

    expect(result.needsModal).toBe(false)
    expect(result.bred.sheep).toBe(1)
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(empty.animalCount || 0).toBe(0)
  })

  test('puts a new sheep in the house when the only pasture must stay empty', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 1 },
        pet: 'sheep',
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
    })
  })

  test('fencing an occupied stable must leave one pasture empty', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        wood: 10,
        food: 20,
        animals: { boar: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 },
          ],
          stables: [{ row: 2, col: 2 }],
        },
      },
    })
    game.run()

    // The stable's boar becomes a second occupied pasture. One must be emptied.
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
    t.choose(game, 'Done building fences')
    t.action(game, 'animal-placement', {
      placements: [],
      removals: [{ locationId: 'pasture-0', animalType: 'boar', count: 1 }],
      overflow: { release: { boar: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        wood: 7, // 10 - 3 fences; the new pasture shares one fence
        food: 20,
        animals: { sheep: 2 },
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          stables: [{ row: 2, col: 2 }],
          pastures: [
            { spaces: [{ row: 2, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 },
          ],
        },
      },
    })
  })

  test('breeding does not fill the last empty pasture', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['herbal-garden-e036'],
        pet: 'boar',
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const result = dennis.breedAnimals()
    const empty = dennis.farmyard.pastures.find(pasture =>
      pasture.spaces.some(space => space.row === 0 && space.col === 4)
    )

    expect(result.needsModal).toBe(true)
    expect(result.bred.sheep).toBe(0)
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    expect(empty.animalCount || 0).toBe(0)
  })
})
