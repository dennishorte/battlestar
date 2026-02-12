const t = require('../../../testutil_v2.js')

describe('Horse-Drawn Boat', () => {
  test('alternates food and sheep on remaining rounds', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['horse-drawn-boat-d041'],
        wood: 2,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Horse-Drawn Boat')

    // Rounds 11-14: food, sheep, food, sheep
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['horse-drawn-boat-d041'],
        scheduled: {
          food: { 11: 1, 13: 1 },
          sheep: { 12: 1, 14: 1 },
        },
      },
    })
  })
})
