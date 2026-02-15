const t = require('../../../testutil_v2.js')

describe('Soil Scientist', () => {
  test('exchanges stone for grain on clay space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['soil-scientist-c114'],
        stone: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Clay Pit')
    t.choose(game, 'Place 1 stone on space for 2 grain')

    t.testBoard(game, {
      dennis: {
        food: 10,
        clay: 1,
        stone: 1,  // 2 - 1
        grain: 2,
        occupations: ['soil-scientist-c114'],
      },
    })
  })
})
