const t = require('../../../testutil_v2.js')

describe('Stone Custodian', () => {
  test('gives 1 food per stone space with accumulated stone at work phase end', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-custodian-e158'],
      },
    })
    game.run()

    // Nobody takes Western Quarry this round — it has 1 accumulated stone
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Work phase ends — Western Quarry has stone → 1 food
    t.testBoard(game, {
      dennis: {
        wood: 3,  // from Forest
        reed: 1,  // from Reed Bank
        food: 1,  // from Stone Custodian (1 stone space with stone)
        occupations: ['stone-custodian-e158'],
      },
    })
  })

  test('no food when stone spaces have been taken', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-custodian-e158'],
      },
    })
    game.run()

    // Dennis takes Western Quarry — stone space now empty
    t.choose(game, 'Western Quarry')  // dennis
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Forest')          // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Work phase ends — no stone spaces with stone → no food
    t.testBoard(game, {
      dennis: {
        wood: 3,   // from Forest
        stone: 1,  // from Western Quarry
        food: 0,   // no Stone Custodian bonus
        occupations: ['stone-custodian-e158'],
      },
    })
  })
})
