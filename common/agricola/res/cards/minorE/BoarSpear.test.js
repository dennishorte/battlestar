const t = require('../../../testutil_v2.js')

describe('Boar Spear', () => {
  test('convert boar to food when taking from Pig Market', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['boar-spear-e053'],
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    t.choose(game, 'Pig Market')    // dennis takes Pig Market (1 boar, auto-placed as pet)
    // onTakeAnimals fires → Boar Spear triggers
    t.choose(game, 'Convert 1 boar to 4 food')

    t.testBoard(game, {
      dennis: {
        food: 4,
        minorImprovements: ['boar-spear-e053'],
      },
    })
  })

  test('keep boar when declining conversion', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['boar-spear-e053'],
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    t.choose(game, 'Pig Market')    // 1 boar, auto-placed as pet
    t.choose(game, 'Keep boar')

    t.testBoard(game, {
      dennis: {
        pet: 'boar',
        animals: { boar: 1 },
        minorImprovements: ['boar-spear-e053'],
      },
    })
  })
})
