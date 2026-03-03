const t = require('../../../testutil_v2.js')

describe('Hayloft Barn', () => {
  test('gives 1 food when gaining grain from action space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        food: 5,
      },
      actionSpaces: ['Grain Seeds'],
    })
    // Set hayloftBarnFood since setBoard skips onPlay
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.hayloftBarnFood = 4
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 6, // 5 + 1 from Hayloft Barn
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
      },
    })
    // Custom card state: hayloftBarnFood has no testBoard equivalent
    const dennis = game.players.byName('dennis')
    expect(dennis.hayloftBarnFood).toBe(3) // 4 - 1
  })

  test('decrements food counter each time grain is gained', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.hayloftBarnFood = 2
    })
    game.run()

    // Dennis takes Grain Seeds
    t.choose(game, 'Grain Seeds')
    // Micah's turn
    t.choose(game, 'Day Laborer')
    // Dennis's turn
    t.choose(game, 'Clay Pit')
    // Micah's turn
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 1 from Grain Seeds
        food: 21, // 20 + 1 from Hayloft Barn
        clay: 1, // Clay Pit
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
      },
    })
    // Custom card state: hayloftBarnFood has no testBoard equivalent
    const dennis = game.players.byName('dennis')
    expect(dennis.hayloftBarnFood).toBe(1) // 2 - 1
  })

  test('triggers family growth when food counter reaches 0', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        food: 5,
      },
      actionSpaces: ['Grain Seeds'],
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.hayloftBarnFood = 1
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 6, // 5 + 1 from Hayloft Barn
        familyMembers: 3, // 2 + 1 from family growth without room
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
      },
    })
    // Custom card state: hayloftBarnFood has no testBoard equivalent
    const dennis = game.players.byName('dennis')
    expect(dennis.hayloftBarnFood).toBe(0)
  })

  test('gives 1 food when harvesting grain from fields', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 4, // first harvest
      dennis: {
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
      micah: { food: 8 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.hayloftBarnFood = 4
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Grain Seeds: +1 grain, triggers Hayloft Barn (food 8 → 9, barn food 4 → 3)
    // Harvest: +1 grain from field, triggers Hayloft Barn (food 9 → 10, barn food 3 → 2)
    // Day Laborer: +2 food → food 10 → 12
    // Feeding: -4 food → food 12 → 8
    t.testBoard(game, {
      dennis: {
        grain: 2, // 1 from Grain Seeds + 1 from harvest
        food: 8, // 8 + 2 (Day Laborer) + 1 (Barn from Grain Seeds) + 1 (Barn from harvest) - 4 (feeding)
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
    const dennis = game.players.byName('dennis')
    expect(dennis.hayloftBarnFood).toBe(2) // 4 - 1 (Grain Seeds) - 1 (harvest)
  })

  test('does not give food when counter is already 0', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
        food: 5,
      },
      actionSpaces: ['Grain Seeds'],
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      dennis.hayloftBarnFood = 0
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 5, // No bonus food
        minorImprovements: ['hayloft-barn-b021'],
        occupations: ['test-occupation-1'],
      },
    })
  })
})
