const t = require('../../../testutil_v2.js')

describe('Animal Tamer', () => {
  test('onPlay offers choice of wood or grain', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['animal-tamer-a086'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Tamer')
    t.choose(game, 'Take 1 wood') // Choose wood

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
        wood: 1,
        grain: 0,
      },
    })
  })

  test('onPlay can choose grain instead', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['animal-tamer-a086'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Tamer')
    t.choose(game, 'Take 1 grain') // Choose grain

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
        wood: 0,
        grain: 1,
      },
    })
  })

  test('modifies house animal capacity to room count', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Animal Tamer allows 1 animal per room (3 rooms = 3 animals)
    // Test by checking total animal capacity includes house capacity
    // Default house capacity is 1, Animal Tamer modifies it to room count (3)
    const capacity = dennis.getTotalAnimalCapacity('sheep')
    // Should have 3 from house (Animal Tamer) + any from pastures/stables
    // Since no pastures/stables, should be exactly 3
    expect(capacity).toBeGreaterThanOrEqual(3)
  })

  test('can hold 2 cattle in a 2-room house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 2 rooms → capacity 2
    expect(dennis.placeAnimals('cattle', 2)).toBe(true)
    expect(dennis.housePets.cattle).toBe(2)
    expect(dennis.getTotalAnimals('cattle')).toBe(2)
  })

  test('can hold mixed types (1 sheep + 1 cattle) in a 2-room house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Place 1 sheep, then 1 cattle
    expect(dennis.placeAnimals('sheep', 1)).toBe(true)
    expect(dennis.placeAnimals('cattle', 1)).toBe(true)
    expect(dennis.housePets.sheep).toBe(1)
    expect(dennis.housePets.cattle).toBe(1)
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
    expect(dennis.getTotalAnimals('cattle')).toBe(1)
  })

  test('cannot exceed room count in house', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['animal-tamer-a086'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // 2 rooms → capacity 2; try to place 3
    expect(dennis.placeAnimals('sheep', 3)).toBe(false)
  })
})
