const t = require('../../../testutil_v2.js')

describe('Sheep Rug', () => {
  test('can be played with 4 sheep (costs 1 sheep) and gives 1 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['sheep-rug-e021'],
        food: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 4 },
          ],
        },
      },
    })
    game.run()

    // dennis: Meeting Place → play Sheep Rug (cost: 1 sheep, prereq: 4 sheep)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sheep Rug')

    // Remaining turns
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fishing')      // micah

    t.testBoard(game, {
      dennis: {
        food: 4,   // 1 + 1 (Meeting Place) + 2 (Day Laborer)
        minorImprovements: ['sheep-rug-e021'],
        animals: { sheep: 3 },  // 4 - 1 cost
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 3 },
          ],
        },
      },
    })
  })
})
