const t = require('../../../testutil_v2.js')

describe('Pole Barns', () => {
  test('builds up to 3 free stables on play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['pole-barns-e001'],
        food: 1,  // Meeting Place gives 1 food
        wood: 2,  // card cost
        farmyard: {
          pastures: [
            { spaces: [
              { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
              { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            ]},
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()

    // Play Pole Barns via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Pole Barns')

    // Build 2 stables, then skip
    t.choose(game, '0,2')   // first stable
    t.choose(game, '1,3')   // second stable
    t.choose(game, 'Skip')  // stop at 2

    // Remaining 3 turns
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    t.testBoard(game, {
      dennis: {
        // wood: 0 (2 - 2 card cost)
        food: 4,    // 1 + 1 (Meeting Place) + 2 (Day Laborer)
        minorImprovements: ['pole-barns-e001'],
        farmyard: {
          pastures: [
            { spaces: [
              { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
              { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            ]},
            { spaces: [{ row: 2, col: 1 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 3 }],
        },
      },
    })
  })
})
