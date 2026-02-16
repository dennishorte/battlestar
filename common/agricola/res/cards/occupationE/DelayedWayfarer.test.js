const t = require('../../../testutil_v2.js')

describe('Delayed Wayfarer', () => {
  test('gives building resource on play and extra action after work phase', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['delayed-wayfarer-e125'],
      },
    })
    game.run()

    // Round 2: Dennis plays Delayed Wayfarer via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Delayed Wayfarer')
    // onPlay fires: choose a building resource
    t.choose(game, '1 wood')

    // Continue round 2 actions
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Work phase ends — Delayed Wayfarer fires
    // Dennis can place a person from supply
    t.choose(game, 'Place person')
    // Dennis takes an extra action (skipUseWorker)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        wood: 1,  // from Delayed Wayfarer
        food: 2,  // from Day Laborer
        grain: 1, // from Grain Seeds
        occupations: ['delayed-wayfarer-e125'],
      },
    })
  })

  test('gives building resource choice — clay', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['delayed-wayfarer-e125'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Delayed Wayfarer')
    t.choose(game, '1 clay')

    // Finish round
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Skip extra person placement
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        food: 2,
        occupations: ['delayed-wayfarer-e125'],
      },
    })
  })

  test('does not trigger extra person in subsequent rounds', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        // Already played — flag was cleared in a previous round
        occupations: ['delayed-wayfarer-e125'],
      },
    })
    game.run()

    // Round 2: no delayedWayfarerPlayer flag set — no extra person prompt
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // No extra person prompt at end of round 2
    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        grain: 1,
        occupations: ['delayed-wayfarer-e125'],
      },
    })
  })
})
