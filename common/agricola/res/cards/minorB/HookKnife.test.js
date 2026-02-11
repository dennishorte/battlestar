const t = require('../../../testutil_v2.js')

describe('Hook Knife', () => {
  test('gives 2 bonus points when sheep count reaches threshold', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hook-knife-b035'],
        wood: 1, // card cost
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
        },
        animals: { sheep: 8 }, // 2-player threshold is 8
      },
    })
    game.run()

    // Play Hook Knife (sets hookKnifeActive = true via onPlay)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hook Knife')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    // Round ends → checkTrigger fires → sheep >= 8 → 2 bonus points

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        wood: 3, // from Forest
        bonusPoints: 2, // from Hook Knife
        animals: { sheep: 8 },
        minorImprovements: ['hook-knife-b035'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 8 },
          ],
        },
      },
    })
  })

  test('no bonus points when below threshold', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hook-knife-b035'],
        wood: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
        animals: { sheep: 3 }, // below 2-player threshold of 8
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hook Knife')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 3,
        bonusPoints: 0, // below threshold
        animals: { sheep: 3 },
        minorImprovements: ['hook-knife-b035'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
          ],
        },
      },
    })
  })
})
