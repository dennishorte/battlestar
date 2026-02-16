const t = require('../../../testutil_v2.js')

describe('Mayor Candidate', () => {
  test('gives 2 wood and 2 stone when played', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mayor-candidate-e124'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Mayor Candidate')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        stone: 2,
        occupations: ['mayor-candidate-e124'],
      },
    })
  })

  test('scoring: loses points for remaining wood and stone', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['mayor-candidate-e124'],
        wood: 2,
        stone: 2,
      },
    })
    game.run()

    // Score breakdown:
    // fields: 0 => -1, pastures: 0 => -1, grain: 0 => -1, veg: 0 => -1
    // sheep: 0 => -1, boar: 0 => -1, cattle: 0 => -1
    // rooms: 2 wood => 0
    // family: 2 => 6
    // unused: 13 => -13
    // Mayor Candidate: -(2 + 2) = -4
    // Total: -7 + 0 + 6 - 13 - 4 = -18
    t.testBoard(game, {
      dennis: {
        score: -18,
        wood: 2,
        stone: 2,
        occupations: ['mayor-candidate-e124'],
      },
    })
  })

  test('scoring: no penalty if wood and stone are spent', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['mayor-candidate-e124'],
        wood: 0,
        stone: 0,
      },
    })
    game.run()

    // Score breakdown without wood/stone penalty:
    // categories: -7, rooms: 0, family: 6, unused: -13, MayorCandidate: 0
    // Total: -7 + 0 + 6 - 13 + 0 = -14
    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['mayor-candidate-e124'],
      },
    })
  })
})
