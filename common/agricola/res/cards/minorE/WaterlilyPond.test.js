const t = require('../../../testutil_v2.js')

describe('Waterlily Pond', () => {
  test('schedules 1 food on next 2 rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['waterlily-pond-e046'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Waterlily Pond')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['waterlily-pond-e046'],
        scheduled: {
          food: { 6: 1, 7: 1 },
        },
      },
    })
  })
})
