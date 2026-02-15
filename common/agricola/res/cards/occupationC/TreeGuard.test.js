const t = require('../../../testutil_v2.js')

describe('Tree Guard', () => {
  test('exchanges 4 wood for resources on wood space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-guard-c102'],
        wood: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Forest gives 3 wood (accumulated) → dennis has 4 wood → exchange
    t.choose(game, 'Forest')
    t.choose(game, 'Place 4 wood for 2 stone, 1 clay, 1 reed, 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 0,  // 1 + 3 - 4
        stone: 2,
        clay: 1,
        reed: 1,
        grain: 1,
        occupations: ['tree-guard-c102'],
      },
    })
  })
})
