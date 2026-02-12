const t = require('../../../testutil_v2.js')

describe('Fruit Ladder', () => {
  test('schedules 1 food on remaining even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fruit-ladder-e045'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Fruit Ladder')

    // Even rounds after 5: 6, 8, 10, 12, 14
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['fruit-ladder-e045'],
        scheduled: {
          food: { 6: 1, 8: 1, 10: 1, 12: 1, 14: 1 },
        },
      },
    })
  })
})
