const t = require('../../../testutil_v2.js')

describe('Adoptive Parents', () => {
  test('allows taking action with adopted newborn when 0 workers and 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['adoptive-parents-a092'],
        food: 2,
        familyMembers: 2,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: { familyMembers: 3 },
    })
    game.run()

    // Round 6: dennis 1st, 3rd, 5th. Dennis uses both workers then adopts.
    t.choose(game, 'Basic Wish for Children')  // dennis (1 worker used, get newborn)
    t.choose(game, 'Clay Pit')       // micah
    t.choose(game, 'Forest')         // dennis (2nd worker → 0 left)
    t.choose(game, 'Day Laborer')    // micah
    // dennis's turn with 0 workers, 1 newborn → Adoptive Parents offer
    t.choose(game, 'Adopt newborn (1 food)')
    t.choose(game, 'Reed Bank')      // dennis takes action with adopted newborn
    t.choose(game, 'Grain Seeds')    // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['adoptive-parents-a092'],
        familyMembers: 3,
        food: 1, // 2 - 1 (adopt)
        wood: 3,
        reed: 1,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }] },
      },
    })
  })
})
