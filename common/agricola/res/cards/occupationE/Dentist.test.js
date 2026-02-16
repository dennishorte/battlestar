const t = require('../../../testutil_v2.js')

describe('Dentist', () => {
  test('places 1 wood on card at harvest start, gets food during feeding', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dentist-e110'],
        wood: 3,
        food: 2,
      },
      micah: { food: 4 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('dentist-e110').wood = 0
    })
    game.run()

    // 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest starts: onHarvestStart fires — place 1 wood
    t.choose(game, 'Place 1 wood')

    // onFeedingPhase fires: gets 1 food (1 wood on card)
    // Feeding: 2 + 2 (DL) - 1 (placed wood) + 1 (dentist food) - 4 (feeding) = 0

    t.testBoard(game, {
      dennis: {
        wood: 2,    // 3 - 1 (placed on card)
        food: 1,    // 2 + 2 (DL) + 1 (dentist) - 4 (feeding) = 1
        reed: 1,
        occupations: ['dentist-e110'],
      },
    })
    expect(game.cardState('dentist-e110').wood).toBe(1)
  })

  test('accumulates wood over multiple harvests', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dentist-e110'],
        wood: 3,
        food: 2,
      },
      micah: { food: 4 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('dentist-e110').wood = 2  // already has 2 wood from previous harvests
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest start: place 1 more wood (now 3 total)
    t.choose(game, 'Place 1 wood')

    // onFeedingPhase: gets 3 food (3 wood on card)
    // food: 2 + 2 (DL) + 3 (dentist) - 4 (feeding) = 3

    t.testBoard(game, {
      dennis: {
        wood: 2,    // 3 - 1 (placed)
        food: 3,    // 2 + 2 + 3 - 4 = 3
        reed: 1,
        occupations: ['dentist-e110'],
      },
    })
    expect(game.cardState('dentist-e110').wood).toBe(3)
  })

  test('can skip placing wood, still gets food for existing wood', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dentist-e110'],
        wood: 1,
        food: 2,
      },
      micah: { food: 4 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('dentist-e110').wood = 1  // 1 wood already on card
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Skip placing wood
    t.choose(game, 'Skip')

    // onFeedingPhase: gets 1 food (1 wood on card)

    t.testBoard(game, {
      dennis: {
        wood: 1,    // unchanged
        food: 1,    // 2 + 2 (DL) + 1 (dentist) - 4 (feeding) = 1
        reed: 1,
        occupations: ['dentist-e110'],
      },
    })
    expect(game.cardState('dentist-e110').wood).toBe(1)
  })
})
