const t = require('../../../testutil_v2.js')

describe('Dairy Crier', () => {
  test('all players can choose 2 food, owner also gets 1 cattle', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dairy-crier-e167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    // Play Dairy Crier via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Dairy Crier')
    // Dennis can choose (has pastures for sheep)
    t.choose(game, '2 food')
    // Micah has no pastures — auto-given 2 food (no choice)

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        animals: { cattle: 1 }, // cattle from Dairy Crier
        occupations: ['dairy-crier-e167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 1 }],
        },
      },
      micah: {
        food: 2, // from Dairy Crier (auto-given)
      },
    })
  })

  test('players can choose 2 sheep if they have room', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dairy-crier-e167'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
            { spaces: [{ row: 2, col: 3 }] },
          ],
        },
      },
      micah: {
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Dairy Crier')
    // Dennis chooses 2 sheep
    t.choose(game, '2 sheep')
    // Micah chooses 2 sheep
    t.choose(game, '2 sheep')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { sheep: 2, cattle: 1 },
        occupations: ['dairy-crier-e167'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 2 },
            { spaces: [{ row: 2, col: 3 }], cattle: 1 },
          ],
        },
      },
      micah: {
        animals: { sheep: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 2 }],
        },
      },
    })
  })

  test('cattle goes as pet when owner has no pastures', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dairy-crier-e167'],
        // no pastures — cattle goes as pet (1 pet capacity)
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Dairy Crier')
    // Both players have no room for 2 sheep — auto-given 2 food each
    // Dennis also gets 1 cattle (placed as pet)

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        pet: 'cattle',
        animals: { cattle: 1 },
        occupations: ['dairy-crier-e167'],
      },
      micah: {
        food: 2,
      },
    })
  })
})
