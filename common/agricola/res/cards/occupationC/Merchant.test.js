const t = require('../../../testutil_v2.js')

describe('Merchant', () => {
  test('offers repeat improvement action for 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['merchant-c096'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Take Major Improvement action — Merchant offers repeat
    t.choose(game, 'Major Improvement')
    // No affordable improvements → skip. Then Merchant fires.
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['merchant-c096'],
      },
    })
  })
})
