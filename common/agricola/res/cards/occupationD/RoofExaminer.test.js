const t = require('../../../testutil_v2.js')

describe('Roof Examiner', () => {
  test('gives 2 reed with 1 major improvement', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['roof-examiner-d145'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Roof Examiner')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 2,
        occupations: ['roof-examiner-d145'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('gives 3 reed with 2 major improvements', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['roof-examiner-d145'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Roof Examiner')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 3,
        occupations: ['roof-examiner-d145'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
      },
    })
  })

  test('gives 0 reed with no major improvements', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['roof-examiner-d145'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Roof Examiner')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['roof-examiner-d145'],
      },
    })
  })
})
