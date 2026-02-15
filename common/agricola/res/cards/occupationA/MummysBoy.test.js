const t = require('../../../testutil_v2.js')

describe("Mummy's Boy", () => {
  test('allows 3rd worker to use same action space as 2nd worker (double action)', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Forest', 'Day Laborer', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['mummys-boy-a130'],
        familyMembers: 3,
        food: 2,
      },
      micah: {
        familyMembers: 2,
        food: 2,
      },
    })
    game.run()

    // dennis 1st worker: Forest
    t.choose(game, 'Forest')
    // micah's turn
    t.choose(game, 'Grain Seeds')
    // dennis 2nd worker: Day Laborer (space now occupied by dennis)
    t.choose(game, 'Day Laborer')
    // micah's turn
    t.choose(game, 'Clay Pit')
    // dennis 3rd worker: can use Day Laborer again (Mummy's Boy)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['mummys-boy-a130'],
        familyMembers: 3,
        food: 6, // 2 + 2 (Day Laborer) + 2 (Day Laborer again)
        wood: 3, // Forest
      },
    })
  })

  test('only allows double action once per round', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Forest', 'Day Laborer', 'Grain Seeds', 'Clay Pit', 'Reed Bank'],
      dennis: {
        occupations: ['mummys-boy-a130'],
        familyMembers: 4,
        food: 2,
      },
      micah: { familyMembers: 2, food: 2 },
      scott: { familyMembers: 2, food: 2 },
    })
    game.run()

    // dennis 1st: Forest
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')  // micah
    t.choose(game, 'Clay Pit')    // scott
    // dennis 2nd: Day Laborer
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Reed Bank')   // micah
    t.choose(game, 'Hollow')     // scott
    // dennis 3rd: Day Laborer again (Mummy's Boy - once per round)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Fishing')    // micah
    // dennis 4th: Day Laborer should NOT appear again (already used double this round)
    t.choose(game, 'Grain Seeds')

    const dennis = t.dennis(game)
    // 4th worker took Grain Seeds (Day Laborer not available - once per round used)
    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBeGreaterThanOrEqual(6) // 2 start + 2 (2nd) + 2 (3rd double)
    expect(dennis.wood).toBe(3)
  })
})
