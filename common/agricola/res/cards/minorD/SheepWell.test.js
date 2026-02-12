const t = require('../../../testutil_v2.js')

describe('Sheep Well', () => {
  test('schedules food up to sheep count', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sheep-well-d045'],
        stone: 2,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 3 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sheep Well')

    // 3 sheep → 3 food scheduled on rounds 9, 10, 11
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        animals: { sheep: 3 },
        minorImprovements: ['sheep-well-d045'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 3 },
          ],
        },
        scheduled: {
          food: { 9: 1, 10: 1, 11: 1 },
        },
      },
    })
  })
})
