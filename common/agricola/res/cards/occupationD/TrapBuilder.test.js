const t = require('../../../testutil_v2.js')

describe('Trap Builder', () => {
  test('schedules food, food, boar on next 3 rounds when using Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['trap-builder-d147'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        occupations: ['trap-builder-d147'],
        scheduled: {
          food: { 3: 1, 4: 1 },
          boar: { 5: 1 },
        },
      },
    })
  })

  test('schedules on correct rounds when used in round 5', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['trap-builder-d147'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 12,
        occupations: ['trap-builder-d147'],
        scheduled: {
          food: { 6: 1, 7: 1 },
          boar: { 8: 1 },
        },
      },
    })
  })
})
