const t = require('../../../testutil_v2.js')

describe('Stable Master', () => {
  // Card text: "When you play this card, you can build 1 stable for 1 wood.
  // Exactly one of your unfenced stables can hold up to 3 animals."

  test('builds stable on play for 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-master-c089'],
        wood: 3,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Master')
    t.choose(game, 'Build stable at 0,2')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
        wood: 2,  // 3 - 1(stable)
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('can skip building stable on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-master-c089'],
        wood: 3,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Master')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
        wood: 3,  // unchanged
      },
    })
  })

  test('unfenced stable holds up to 3 animals', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-master-c089'],
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Take 3 sheep — unfenced stable should hold all 3
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
        animals: { sheep: 3 },
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('only one of multiple unfenced stables gets the +2 bonus', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 5 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-master-c089'],
        farmyard: {
          stables: [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Stable capacity: 3 (bonus) + 1 + 1 = 5, not 3 * 3 = 9.
    const dennis = game.players.byName('dennis')
    expect(dennis.getUnfencedStableCapacity()).toBe(5)
    // Total adds the 1-slot house: 5 stables + 1 house = 6.
    expect(dennis.getTotalAnimalCapacity('sheep')).toBe(6)

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
        animals: { sheep: 5 },
        farmyard: {
          stables: [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
  })

  test('removing 1 sheep from a 3-sheep stable leaves 2', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-master-c089'],
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Sheep Market')

    let dennis = game.players.byName('dennis')
    const space = dennis.getSpace(0, 2)
    expect(space.animal).toBe('sheep')
    expect(space.animalCount).toBe(3)

    dennis.removeAnimals('sheep', 1)

    dennis = game.players.byName('dennis')
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    const after = dennis.getSpace(0, 2)
    expect(after.animal).toBe('sheep')
    expect(after.animalCount).toBe(2)
  })

  test('no stable offer when no wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-master-c089'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Master')

    // No stable offer — card just played without building
    t.testBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
        wood: 0,
      },
    })
  })
})
