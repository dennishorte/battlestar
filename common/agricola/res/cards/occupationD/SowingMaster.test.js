const t = require('../../../testutil_v2.js')

describe('Sowing Master', () => {
  test('gives 1 wood when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sowing-master-d109'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Sowing Master')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        occupations: ['sowing-master-d109'],
      },
    })
  })

  test('gives 2 food when using Grain Utilization (sow-bake)', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['sowing-master-d109'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    // 1 field, 0 remaining grain → sow loop auto-exits

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // from Sowing Master onAction
        occupations: ['sowing-master-d109'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('does not trigger on non-sowing action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sowing-master-d109'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // just Day Laborer, no Sowing Master bonus
        occupations: ['sowing-master-d109'],
      },
    })
  })
})
