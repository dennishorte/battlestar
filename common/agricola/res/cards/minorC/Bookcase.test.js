const t = require('../../../testutil_v2.js')

describe('Bookcase', () => {
  test('gives 1 vegetable when playing an occupation', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bookcase-c068'],
        occupations: ['test-occupation-1'],
        hand: ['test-occupation-2'],
        food: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play occupation via Lessons A → Bookcase fires → 1 vegetable
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 2')

    t.testBoard(game, {
      dennis: {
        vegetables: 1,
        food: 2, // 3 - 1 (Lessons A cost for 2nd occupation)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['bookcase-c068'],
        hand: [],
      },
    })
  })

  test('does not trigger for minor improvements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bookcase-c068'],
        occupations: ['test-occupation-1'],
        hand: ['test-minor-1'],
      },
      micah: { food: 10 },
    })
    game.run()

    // Play minor improvement → Bookcase should NOT fire
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      dennis: {
        vegetables: 0,
        food: 1,
        occupations: ['test-occupation-1'],
        minorImprovements: ['bookcase-c068', 'test-minor-1'],
      },
    })
  })
})
