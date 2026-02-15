const t = require('../../../testutil_v2.js')

describe('Private Teacher', () => {
  test('offers occupation play when Lessons is occupied', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['private-teacher-c131'],
        hand: ['test-occupation-1'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Micah occupies Lessons A first (auto-resolves since micah has no hand)
    t.choose(game, 'Lessons A')

    // Dennis takes Grain Seeds — Lessons is occupied, triggers Private Teacher
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        food: 9,  // 10 - 1 for occupation cost
        grain: 1,
        occupations: ['private-teacher-c131', 'test-occupation-1'],
      },
    })
  })
})
