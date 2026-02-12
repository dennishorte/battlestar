const t = require('../../../testutil_v2.js')

describe('Mole Plow', () => {
  test('plows 1 additional field on Farmland action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mole-plow-c020'],
      },
    })
    game.run()

    // Farmland plows 1 field, then Mole Plow triggers to plow a second
    t.choose(game, 'Farmland')
    t.choose(game, '0,2')          // first plow (Farmland)
    t.choose(game, '0,3')          // second plow (Mole Plow)

    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        food: 0,
        wood: 3,
        minorImprovements: ['mole-plow-c020'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })
})
