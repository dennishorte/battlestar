const t = require('../../../testutil_v2.js')

describe('Excursion to the Quarry', () => {
  test('gives stone equal to family members', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['excursion-to-the-quarry-b006'],
        food: 2, // card cost
        occupations: ['test-occupation-1'], // prereq: 1 occ
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Excursion to the Quarry')

    t.testBoard(game, {
      dennis: {
        food: 1, // 2 - 2 (cost) + 1 (Meeting Place)
        stone: 2, // 2 family members
        occupations: ['test-occupation-1'],
        minorImprovements: ['excursion-to-the-quarry-b006'],
      },
    })
  })

  test('gives more stone with more family members', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['excursion-to-the-quarry-b006'],
        food: 2,
        familyMembers: 3,
        occupations: ['test-occupation-1'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Excursion to the Quarry')

    t.testBoard(game, {
      dennis: {
        food: 1,
        stone: 3, // 3 family members
        familyMembers: 3,
        occupations: ['test-occupation-1'],
        minorImprovements: ['excursion-to-the-quarry-b006'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
