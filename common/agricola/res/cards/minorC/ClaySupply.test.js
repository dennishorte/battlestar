const t = require('../../../testutil_v2.js')

describe('Clay Supply', () => {
  test('schedules 1 clay on next 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-supply-c077'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Clay Supply')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // +1 MP, -1 cost
        minorImprovements: ['clay-supply-c077'],
        scheduled: {
          clay: { 4: 1, 5: 1, 6: 1 },
        },
      },
    })
  })
})
