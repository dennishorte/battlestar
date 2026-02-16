const t = require('../../../testutil_v2.js')

describe('Nightworker', () => {
  // Card text: "Before the start of each work phase, you can place a person
  // on an accumulation space of a building resource not in your supply."

  test('places person on Forest before work phase when player has no wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nightworker-c125'],
      },
    })
    game.run()

    // Nightworker fires before work phase — dennis has 0 of all building resources
    // Offers: Pass, Forest (3 wood), Clay Pit (1 clay), Reed Bank (1 reed)
    t.choose(game, 'Forest (3 wood)')

    // Dennis used 1 worker via Nightworker, has 1 left
    // Main loop: Dennis (1 worker), Micah (2 workers)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Day Laborer')
    // Dennis has 0 workers, skipped
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 1,
        occupations: ['nightworker-c125'],
      },
    })
  })

  test('can pass on Nightworker offer', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nightworker-c125'],
      },
    })
    game.run()

    // Nightworker fires but Dennis passes
    t.choose(game, 'Pass')

    // Normal work phase: Dennis (2 workers), Micah (2 workers)
    t.choose(game, 'Forest')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 1,
        occupations: ['nightworker-c125'],
      },
    })
  })

  test('not offered when player has all building resources', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['nightworker-c125'],
        wood: 1,
        clay: 1,
        reed: 1,
      },
    })
    game.run()

    // Dennis has wood, clay, reed > 0; stone is missing but no stone
    // accumulation space exists in round 1. No Nightworker offer.
    // Normal work phase: Dennis (2 workers), Micah (2 workers)
    t.choose(game, 'Forest')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 4, // 1 starting + 3 from Forest
        clay: 1,
        reed: 1,
        food: 1,
        occupations: ['nightworker-c125'],
      },
    })
  })
})
