const t = require('../../../testutil_v2.js')

describe('Working Gloves', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['working-gloves-e060'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Working Gloves')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // 1 from Working Gloves + 1 from Meeting Place
        minorImprovements: ['working-gloves-e060'],
      },
    })
  })
})
