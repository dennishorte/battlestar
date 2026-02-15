const t = require('../../../testutil_v2.js')

describe('Animal Teacher', () => {
  // Card is 4+ players. onAction: after Lessons → may buy 1 sheep/boar/cattle for 0/1/2 food.

  test('onAction after Lessons A offers buy sheep for 0, boar for 1, cattle for 2; choose sheep', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-teacher-a168'],
        hand: ['task-artisan-a096'],
        food: 2,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Task Artisan')
    t.choose(game, 'Buy 1 sheep for 0 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-teacher-a168', 'task-artisan-a096'],
        food: 1,
        wood: 1,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 1 },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
  })

  test('onAction after Lessons allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-teacher-a168'],
        hand: ['task-artisan-a096'],
        food: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Task Artisan')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-teacher-a168', 'task-artisan-a096'],
        food: 1,
        wood: 1,
        animals: { sheep: 0, boar: 0, cattle: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('onAction after Lessons can buy boar for 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-teacher-a168'],
        hand: ['task-artisan-a096'],
        food: 3,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Task Artisan')
    t.choose(game, 'Buy 1 wild boar for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-teacher-a168', 'task-artisan-a096'],
        food: 1,
        wood: 1,
        animals: { boar: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], boar: 1 },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
  })
})
