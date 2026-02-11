const t = require('../../../testutil_v2.js')

describe('Digging Spade', () => {
  test('gives food equal to boar count when using take-clay', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['digging-spade-b051'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
        animals: { boar: 2 },
      },
    })
    game.run()

    // Check how much clay is accumulated before taking
    const clayBefore = game.state.actionSpaces['take-clay'].accumulated
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 2 from Digging Spade (2 boar)
        clay: clayBefore, // whatever accumulated on Clay Pit
        animals: { boar: 2 },
        minorImprovements: ['digging-spade-b051'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 2 }],
        },
      },
    })
  })

  test('no extra food when no boar', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['digging-spade-b051'],
      },
    })
    game.run()

    const clayBefore = game.state.actionSpaces['take-clay'].accumulated
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 0, // no boar, no Digging Spade bonus
        clay: clayBefore, // whatever accumulated
        minorImprovements: ['digging-spade-b051'],
      },
    })
  })
})
