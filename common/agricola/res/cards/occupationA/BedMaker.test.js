const t = require('../../../testutil_v2.js')

describe('Bed Maker', () => {
  test('onBuildRoom offers family growth for 1 wood and 1 grain', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['bed-maker-a093'],
        wood: 6,
        reed: 2,
        grain: 1,
        familyMembers: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Pay 1 wood and 1 grain for Family Growth with Room Only')

    t.testBoard(game, {
      dennis: {
        occupations: ['bed-maker-a093'],
        wood: 0,
        grain: 0,
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('onBuildRoom allows skipping the family growth offer', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['bed-maker-a093'],
        wood: 6,
        reed: 2,
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['bed-maker-a093'],
        wood: 1,
        grain: 1,
        familyMembers: 2,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})
