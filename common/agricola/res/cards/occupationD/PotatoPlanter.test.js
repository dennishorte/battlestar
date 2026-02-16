const t = require('../../../testutil_v2.js')

describe('Potato Planter', () => {
  test('gives 1 vegetable when occupying Clay Pit while Reed Bank is free', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['potato-planter-d142'],
      },
    })
    game.run()

    // Full round: 4 actions (dennis, micah, dennis, micah)
    t.choose(game, 'Clay Pit')        // dennis occupies Clay Pit
    t.choose(game, 'Forest')          // micah
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    // Work phase ends: dennis occupies Clay Pit, Reed Bank is free → +1 vegetable

    t.testBoard(game, {
      dennis: {
        clay: 1,        // from Clay Pit (1 accumulated at round 2)
        food: 2,        // from Day Laborer
        vegetables: 1,  // from Potato Planter
        occupations: ['potato-planter-d142'],
      },
    })
  })

  test('gives 1 vegetable when occupying Reed Bank while Clay Pit is free', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['potato-planter-d142'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')       // dennis occupies Reed Bank
    t.choose(game, 'Forest')          // micah
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah

    t.testBoard(game, {
      dennis: {
        reed: 1,        // from Reed Bank (1 accumulated at round 2)
        food: 2,        // from Day Laborer
        vegetables: 1,  // from Potato Planter
        occupations: ['potato-planter-d142'],
      },
    })
  })

  test('does not give vegetable when both Clay Pit and Reed Bank are occupied', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['potato-planter-d142'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')        // dennis occupies Clay Pit
    t.choose(game, 'Reed Bank')       // micah occupies Reed Bank
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    // Both occupied → no vegetable

    t.testBoard(game, {
      dennis: {
        clay: 1,
        food: 2,
        occupations: ['potato-planter-d142'],
      },
    })
  })
})
