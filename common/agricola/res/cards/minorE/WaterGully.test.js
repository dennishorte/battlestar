const t = require('../../../testutil_v2.js')

describe('Water Gully', () => {
  test('schedules cattle, grain, cattle on next 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['water-gully-e042'],
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Water Gully')

    // Rounds 6: cattle, 7: grain, 8: cattle
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['water-gully-e042'],
        scheduled: {
          cattle: { 6: 1, 8: 1 },
          grain: { 7: 1 },
        },
      },
    })
  })
})
