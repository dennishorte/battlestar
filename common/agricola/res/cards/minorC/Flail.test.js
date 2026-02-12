const t = require('../../../testutil_v2.js')

describe('Flail', () => {
  test('gives 2 food on play', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['flail-c026'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Flail')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3, // 2 from Flail + 1 from Meeting Place
        wood: 0,
        minorImprovements: ['flail-c026'],
      },
    })
  })
})
