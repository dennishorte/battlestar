const t = require('../../../testutil_v2.js')

describe('Strawberry Patch', () => {
  test('schedules 1 food each on next 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['strawberry-patch-b045'],
        wood: 1, // card cost
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Strawberry Patch')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { food: { 2: 1, 3: 1, 4: 1 } },
        minorImprovements: ['strawberry-patch-b045'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })
})
