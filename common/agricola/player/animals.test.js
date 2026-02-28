const t = require('../testutil.js')

describe('animals', () => {
  test('pet can hold one animal', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.placeAnimals('sheep', 1)).toBe(true)

    expect(dennis.pet).toBe('sheep')
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
  })

  test('unfenced stable holds one animal', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.buildStable(2, 0)

    expect(dennis.placeAnimals('sheep', 2)).toBe(true)
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
  })

  test('pasture holds 2 animals per space', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 2, col: 0 }, { row: 2, col: 1 }])

    // 2 spaces * 2 = 4 capacity, plus 1 pet = 5 total
    expect(dennis.placeAnimals('sheep', 5)).toBe(true)
    expect(dennis.getTotalAnimals('sheep')).toBe(5)
  })

  test('stable in pasture doubles capacity', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.buildStable(2, 0)
    t.addPasture(dennis, [{ row: 2, col: 0 }])

    // 1 space * 2 * 2 (stable) = 4, plus 1 pet = 5
    expect(dennis.canPlaceAnimals('sheep', 5)).toBe(true)
  })

  test('removeAnimals removes from inventory', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 3)
    dennis.pet = 'sheep'

    expect(dennis.removeAnimals('sheep', 2)).toBe(true)
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
  })

  test('breedAnimals creates offspring', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 2)

    const bred = dennis.breedAnimals()

    expect(bred.sheep).toBe(1)
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
  })

  test('breedAnimals requires 2 animals', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 1)

    const bred = dennis.breedAnimals()

    expect(bred.sheep).toBe(0)
  })

  test('canPlaceAnimals returns false when pet slot is occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.pet = 'boar'

    // No pastures, no unfenced stables, pet occupied by boar.
    // Should not be able to place sheep anywhere.
    expect(dennis.canPlaceAnimals('sheep', 1)).toBe(false)
  })

  test('canPlaceAnimals returns false when unfenced stable is occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.pet = 'boar'
    dennis.buildStable(2, 0)

    // Place a boar in the unfenced stable
    const space = dennis.getSpace(2, 0)
    space.animal = 'boar'
    space.animalCount = 1

    // Pet has boar, unfenced stable has boar. No pastures.
    // Should not be able to place sheep.
    expect(dennis.canPlaceAnimals('sheep', 1)).toBe(false)
  })

  test('getTotalAnimalCapacity excludes pet slot occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.pet = 'boar'

    // Capacity for sheep should be 0 (pet has boar, no pastures, no stables)
    expect(dennis.getTotalAnimalCapacity('sheep')).toBe(0)
    // Capacity for boar should still include the pet slot
    expect(dennis.getTotalAnimalCapacity('boar')).toBe(1)
  })

  test('getTotalAnimalCapacity excludes unfenced stable occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.pet = null
    dennis.buildStable(2, 0)

    // Place a boar in the unfenced stable
    const space = dennis.getSpace(2, 0)
    space.animal = 'boar'
    space.animalCount = 1

    // Capacity for sheep: 1 (empty pet) + 0 (stable has boar) = 1
    expect(dennis.getTotalAnimalCapacity('sheep')).toBe(1)
    // Capacity for boar: 1 (empty pet) + 1 (stable has boar) = 2
    expect(dennis.getTotalAnimalCapacity('boar')).toBe(2)
  })

  test('animals are not silently dropped when pet has different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.pet = 'boar'

    // Try to add sheep - should fail since there's nowhere to put them
    expect(dennis.placeAnimals('sheep', 1)).toBe(false)
    expect(dennis.getTotalAnimals('sheep')).toBe(0)
    // Boar should still be in pet slot
    expect(dennis.pet).toBe('boar')
  })
})
