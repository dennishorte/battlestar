const t = require('../../../testutil_v2.js')

describe('Old Miser', () => {
  test('reduces feeding requirement by 1 per person during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['old-miser-e159'],
        food: 2, // 2 people need 4 food normally, Old Miser reduces by 2 -> need 2
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: feeding. 2 people * 2 food = 4. Old Miser gives +2 food before feeding.
    // So dennis has 2 + 2 (Day Laborer) + 2 (Old Miser) = 6, needs 4 -> has 2 left
    t.testBoard(game, {
      round: 5,
      dennis: {
        food: 2, // 2 + 2 (Day Laborer) + 2 (Old Miser) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        occupations: ['old-miser-e159'],
      },
    })
  })

  test('gives -1 points per person at end game', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['old-miser-e159'],
      },
    })
    game.run()

    // Base score with 2 family members, all defaults:
    // -13 (empty spaces) + -1 (fields) + -1 (pastures) + -1 (grain) + -1 (veg)
    // + -1 (sheep) + -1 (boar) + -1 (cattle) + 6 (family: 2*3)
    // + (-2 from Old Miser: -1 per person)
    // = -13 -7 +6 -2 = -16
    t.testBoard(game, {
      dennis: {
        score: -16,
        occupations: ['old-miser-e159'],
      },
    })
  })
})
