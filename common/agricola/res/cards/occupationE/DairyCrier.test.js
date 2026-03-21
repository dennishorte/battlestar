const t = require('../../../testutil_v2.js')

describe('Dairy Crier', () => {
  test('all players choose 2 sheep or 2 food, owner also gets 1 cattle', () => {
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

  test('players without room for sheep still get the choice', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dairy-crier-e167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
      // Micah has no pastures — should still get the choice
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Dairy Crier')
    // Dennis chooses 2 food
    t.choose(game, '2 food')
    // Micah gets the choice even without pastures — chooses 2 food
    t.choose(game, '2 food')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        animals: { cattle: 1 },
        occupations: ['dairy-crier-e167'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 1 }],
        },
      },
      micah: {
        food: 2,
      },
    })
  })

  test('owner always gets 1 cattle even without pastures', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dairy-crier-e167'],
        // no pastures — cattle goes as pet
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Dairy Crier')
    // Dennis chooses 2 food
    t.choose(game, '2 food')
    // Micah chooses 2 food
    t.choose(game, '2 food')
    // Dennis gets 1 cattle placed as pet

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
