const t = require('../../../testutil_v2.js')

describe('Thresher', () => {
  test('offers grain purchase before Grain Utilization', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['thresher-c112'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Pay 1 food for 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 1,
        occupations: ['thresher-c112'],
      },
    })
  })
})
