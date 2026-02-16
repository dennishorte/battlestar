const t = require('../../../testutil_v2.js')

describe('Hewer', () => {
  test('gives 1 stone and 1 food when all clay spaces unoccupied from round 3+', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['hewer-e143'],
      },
    })
    game.run()

    // Nobody uses Clay Pit this round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Grain Seeds')  // micah
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Work phase ends — all clay spaces unoccupied → Hewer triggers
    t.testBoard(game, {
      round: 4,
      dennis: {
        wood: 3,  // from Forest
        stone: 1, // from Hewer
        food: 3,  // 2 Day Laborer + 1 Hewer
        occupations: ['hewer-e143'],
      },
    })
  })

  test('does not trigger when clay space is occupied', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['hewer-e143'],
      },
    })
    game.run()

    // Dennis takes Clay Pit
    t.choose(game, 'Clay Pit')     // dennis — clay space occupied!
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Grain Seeds')  // micah

    // Work phase ends — clay space was occupied → Hewer does NOT trigger
    t.testBoard(game, {
      round: 4,
      dennis: {
        wood: 3,  // from Forest (3 wood/round, 1 round accumulation)
        clay: 1,  // from Clay Pit (1 round accumulation)
        stone: 0,
        food: 0,
        occupations: ['hewer-e143'],
      },
    })
  })
})
