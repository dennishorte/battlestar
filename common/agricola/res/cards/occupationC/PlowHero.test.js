const t = require('../../../testutil_v2.js')

describe('Plow Hero', () => {
  test('offers extra plow on Farmland with first person', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-hero-c091'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // First person: Farmland — pick field space, then PlowHero offers extra
    t.choose(game, 'Farmland')
    t.choose(game, '2,0')  // plow base field
    // Plow Hero fires: offer to plow extra for 1 food
    t.choose(game, 'Pay 1 food to plow 1 additional field')
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,1')  // plow extra field

    t.testBoard(game, {
      dennis: {
        food: 9,
        occupations: ['plow-hero-c091'],
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('offers extra plow before sow on Cultivation with first person', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Cultivation'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-hero-c091'],
        food: 10,
        grain: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Cultivation')
    t.choose(game, 'Plow a field')
    t.choose(game, '2,0')  // plow base field
    // onBeforeSow: Plow Hero offers extra plow before sowing
    t.choose(game, 'Pay 1 food to plow 1 additional field')
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,1')  // plow extra field
    // now sow into the two new fields
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    t.action(game, 'sow-field', { row: 2, col: 1, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 0,
        occupations: ['plow-hero-c091'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })
})
