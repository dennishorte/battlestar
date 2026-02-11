const t = require('../../../testutil_v2.js')

describe('Chophouse', () => {
  test('schedules 1 food on next 3 rounds when using take-grain', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['chophouse-b043'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1, // from Grain Seeds
        scheduled: { food: { 2: 1, 3: 1, 4: 1 } },
        minorImprovements: ['chophouse-b043'],
      },
    })
  })

  test('schedules 1 food on next 2 rounds when using take-vegetable', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['chophouse-b043'],
      },
    })
    game.run()

    t.choose(game, 'Vegetable Seeds')

    const round = game.state.round
    t.testBoard(game, {
      dennis: {
        vegetables: 1, // from Vegetable Seeds
        scheduled: { food: { [round + 1]: 1, [round + 2]: 1 } },
        minorImprovements: ['chophouse-b043'],
      },
    })
  })
})
