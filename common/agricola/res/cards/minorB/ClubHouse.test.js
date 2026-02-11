const t = require('../../../testutil_v2.js')

describe('Club House', () => {
  test('schedules food for 4 rounds and stone on round 5', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['club-house-b046'],
        wood: 3, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Club House')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: {
          food: { 2: 1, 3: 1, 4: 1, 5: 1 },
          stone: { 6: 1 },
        },
        minorImprovements: ['club-house-b046'],
      },
    })
  })
})
