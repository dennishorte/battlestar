const t = require('../../../testutil_v2.js')

describe('Herbal Garden', () => {
  test('can be played with 1 pasture and gives 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['herbal-garden-e036'],
        wood: 1,
        food: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    // dennis: Meeting Place → play Herbal Garden (cost: 1 wood, prereq: 1 pasture)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Herbal Garden')

    // Remaining turns
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fishing')      // micah

    t.testBoard(game, {
      dennis: {
        // wood: 0  (1 - 1 cost)
        food: 4,   // 1 + 1 (Meeting Place) + 2 (Day Laborer)
        minorImprovements: ['herbal-garden-e036'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] },
          ],
        },
      },
    })
  })
})
