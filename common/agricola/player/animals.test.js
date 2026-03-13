const t = require('../testutil.js')

describe('animals', () => {
  test('pet can hold one animal', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.placeAnimals('sheep', 1)).toBe(true)

    expect(dennis.housePets.sheep).toBe(1)
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
    dennis.housePets.sheep = 1

    expect(dennis.removeAnimals('sheep', 2)).toBe(true)
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
  })

  test('breedAnimals creates offspring', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 2)

    const result = dennis.breedAnimals()

    expect(result.bred.sheep).toBe(1)
    expect(result.needsModal).toBe(false)
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
  })

  test('breedAnimals requires 2 animals', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 1)

    const result = dennis.breedAnimals()

    expect(result.bred.sheep).toBe(0)
    expect(result.needsModal).toBe(false)
  })

  test('canPlaceAnimals returns false when pet slot is occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.housePets.boar = 1

    // No pastures, no unfenced stables, pet occupied by boar.
    // Should not be able to place sheep anywhere.
    expect(dennis.canPlaceAnimals('sheep', 1)).toBe(false)
  })

  test('canPlaceAnimals returns false when unfenced stable is occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.housePets.boar = 1
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
    dennis.housePets.boar = 1

    // Capacity for sheep should be 0 (pet has boar, no pastures, no stables)
    expect(dennis.getTotalAnimalCapacity('sheep')).toBe(0)
    // Capacity for boar should still include the pet slot
    expect(dennis.getTotalAnimalCapacity('boar')).toBe(1)
  })

  test('getTotalAnimalCapacity excludes unfenced stable occupied by different type', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
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
    dennis.housePets.boar = 1

    // Try to add sheep - should fail since there's nowhere to put them
    expect(dennis.placeAnimals('sheep', 1)).toBe(false)
    expect(dennis.getTotalAnimals('sheep')).toBe(0)
    // Boar should still be in house
    expect(dennis.housePets.boar).toBe(1)
  })

  test('breedAnimals breeds boar despite fragmented distribution', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    // Sheep pasture (2 spaces, capacity 4, has 2 sheep, room for more)
    t.addPasture(dennis, [{ row: 0, col: 2 }, { row: 0, col: 3 }], 'sheep', 2)

    // "Wrong" pasture - has 1 sheep from a previous auto-placement
    // This is the pasture meant for boar (1 space + stable, capacity 4)
    dennis.buildStable(2, 3)
    t.addPasture(dennis, [{ row: 2, col: 3 }], 'sheep', 1)

    // 2 boar in unfenced stables (the "weird distribution")
    dennis.buildStable(2, 1)
    dennis.buildStable(2, 2)
    const s1 = dennis.getSpace(2, 1)
    s1.animal = 'boar'
    s1.animalCount = 1
    const s2 = dennis.getSpace(2, 2)
    s2.animal = 'boar'
    s2.animalCount = 1

    // House occupied
    dennis.housePets.cattle = 1

    // Verify initial state: 3 sheep (2 in pasture + 1 in "wrong" pasture), 2 boar
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(dennis.getTotalAnimals('boar')).toBe(2)

    // Bug: boar can't breed because all pastures are typed as sheep
    // No pasture is empty or typed as boar
    // Capacity for boar = 0 (pastures) + 2 (stables at cap) + 0 (pet) = 2
    // 2 + 1 > 2 → can't breed!
    // Fix: consolidate sheep into the main sheep pasture first, freeing the "wrong" pasture
    const result = dennis.breedAnimals()

    expect(result.bred.sheep).toBe(1)
    expect(result.bred.boar).toBe(1)
    expect(dennis.getTotalAnimals('sheep')).toBe(4) // 3 + 1 baby
    expect(dennis.getTotalAnimals('boar')).toBe(3) // 2 + 1 baby
  })

  test('breedAnimals breeds boar when boar is in unfenced stables and empty pasture exists', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    // Sheep pasture with room (2 spaces, capacity 4, has 2 sheep)
    t.addPasture(dennis, [{ row: 0, col: 2 }, { row: 0, col: 3 }], 'sheep', 2)

    // Empty pasture with stable (1 space + stable, capacity 4)
    dennis.buildStable(2, 3)
    t.addPasture(dennis, [{ row: 2, col: 3 }])

    // 2 boar in unfenced stables
    dennis.buildStable(2, 1)
    dennis.buildStable(2, 2)
    const s1 = dennis.getSpace(2, 1)
    s1.animal = 'boar'
    s1.animalCount = 1
    const s2 = dennis.getSpace(2, 2)
    s2.animal = 'boar'
    s2.animalCount = 1

    // Verify initial counts
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    expect(dennis.getTotalAnimals('boar')).toBe(2)

    const result = dennis.breedAnimals()

    // Both should breed
    expect(result.bred.sheep).toBe(1)
    expect(result.bred.boar).toBe(1)
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(dennis.getTotalAnimals('boar')).toBe(3)
  })

  test('snapshot and restore reverts animal state', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 2)
    dennis.housePets.boar = 1

    const snapshot = dennis._snapshotAnimalState()

    // Modify state
    dennis.placeAnimals('sheep', 1)
    dennis.housePets.cattle = 1
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(dennis.housePets.cattle).toBe(1)

    // Restore
    dennis._restoreAnimalState(snapshot)
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    expect(dennis.housePets.boar).toBe(1)
    expect(dennis.housePets.cattle).toBe(0)
  })

  test('breedAnimals returns needsModal when babies do not fit', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    // Small pasture at capacity with 2 sheep - can breed but baby won't fit
    t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 2)
    // House occupied by boar
    dennis.housePets.boar = 1

    const result = dennis.breedAnimals()

    expect(result.needsModal).toBe(true)
    expect(result.pendingBabies).toEqual({ sheep: 1 })
    // State should be rolled back - still 2 sheep
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    expect(dennis.housePets.boar).toBe(1)
  })

  test('applyAnimalPlacements validates breeding constraints - no cooking babies', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 2)

    // Remove 2 existing sheep, cook 2 (1 existing + 1 baby), place 1 baby
    // Accounting: removed(2) + incoming(1) = 3 = placed(1) + cooked(2) + released(0) ✓
    // But cooked(2) > removed(2) is fine...
    // To trigger: remove 1, incoming 1 baby, cook 2 (more than removed), place 0
    // Accounting: removed(1) + incoming(1) = 2 = placed(0) + cooked(2) + released(0) ✓
    // Breeding: cooked(2) > removed(1) → cannot cook babies
    const result = dennis.applyAnimalPlacements({
      placements: [],
      overflow: { cook: { sheep: 2 } },
      incoming: { sheep: 1 },
      removals: [
        { locationId: 'pasture-0', animalType: 'sheep', count: 1 },
      ],
      breedingConstraints: {
        requirements: { sheep: 2 },
        acceptedBabies: { sheep: 0 },
      },
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Cannot cook babies/)
  })

  test('applyAnimalPlacements validates breeding constraints - parents must remain', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }], 'sheep', 3)

    // Accept 1 baby but only place 2 sheep (need 2 parents + 1 baby = 3 placed)
    const result = dennis.applyAnimalPlacements({
      placements: [
        { locationId: 'pasture-0', animalType: 'sheep', count: 2 },
      ],
      overflow: { release: { sheep: 2 } },
      incoming: { sheep: 1 },
      removals: [
        { locationId: 'pasture-0', animalType: 'sheep', count: 3 },
      ],
      breedingConstraints: {
        requirements: { sheep: 2 },
        acceptedBabies: { sheep: 1 },
      },
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Not enough sheep parents/)
  })
})
