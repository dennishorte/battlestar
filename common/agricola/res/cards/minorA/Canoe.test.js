const t = require('../../../testutil_v2.js')

describe('Canoe', () => {
  test('gives +1 food and +1 reed on Fishing action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['canoe-a078'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 accumulated + 1 from Canoe
        reed: 1, // +1 from Canoe
        occupations: ['test-occupation-1'],
        minorImprovements: ['canoe-a078'],
      },
    })
  })
})
