const t = require('../../../testutil_v2.js')

describe('Grain Depot', () => {
  test('schedules grain on next 2 rounds with wood payment', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { grain: { 2: 1, 3: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })

  test('schedules grain on next 3 rounds with clay payment', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        clay: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    t.testBoard(game, {
      dennis: {
        food: 1,
        scheduled: { grain: { 2: 1, 3: 1, 4: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })

  test('schedules grain on next 4 rounds with stone payment', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    t.testBoard(game, {
      dennis: {
        food: 1,
        scheduled: { grain: { 2: 1, 3: 1, 4: 1, 5: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })

  test('prompts cost choice when player can afford multiple options', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        wood: 2,
        clay: 2,
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    // Player should be prompted to choose payment — pick stone for 4 rounds
    t.choose(game, '2 stone')

    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 2,
        clay: 2,
        scheduled: { grain: { 2: 1, 3: 1, 4: 1, 5: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })

  test('prompts cost choice and selects clay for 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        wood: 2,
        clay: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    // Choose clay payment for 3 rounds
    t.choose(game, '2 clay')

    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 2,
        scheduled: { grain: { 2: 1, 3: 1, 4: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })
})
