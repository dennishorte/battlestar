const t = require('../../../testutil_v2.js')

describe('Pitchfork', () => {
  test('gives 3 food when using take-grain while plow-field is occupied', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['pitchfork-b062'],
      },
    })
    game.run()

    // Dennis takes Farmland (plow-field) to occupy it
    t.choose(game, 'Farmland')
    t.choose(game, '2,0') // plow a field
    // Micah does anything
    t.choose(game, 'Day Laborer')
    // Dennis takes Grain Seeds — Pitchfork triggers since plow-field is occupied
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 3, // from Pitchfork
        grain: 1, // from Grain Seeds
        minorImprovements: ['pitchfork-b062'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('no extra food when plow-field is NOT occupied', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['pitchfork-b062'],
      },
    })
    game.run()

    // Dennis takes Grain Seeds without anyone on plow-field
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 0,
        grain: 1, // from Grain Seeds only
        minorImprovements: ['pitchfork-b062'],
      },
    })
  })
})
