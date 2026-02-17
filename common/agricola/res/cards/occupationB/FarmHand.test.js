const t = require('../../../testutil_v2.js')

describe('Farm Hand', () => {
  // Card text: "Once you have 4 field tiles arranged in a 2x2, you can
  // use a 'Build Stables' action to build a stable in the center of the
  // 2x2. This stable provides room for a person but no animal."
  //
  // The center stable behavior (allowsCenterStable) is a passive flag on
  // the card definition. The e2e tests verify the card can be played and
  // remains in the player's occupations.

  test('can be played as an occupation', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['farm-hand-b085'],
      },
    })
    game.run()

    // Play Farm Hand via Lessons A (first occupation is free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Farm Hand')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['farm-hand-b085'],
      },
    })
  })

  test('stays in occupations after playing additional rounds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['farm-hand-b085'],
        farmyard: {
          fields: [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
    game.run()

    // Take actions for round 1
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer
        clay: 1, // Clay Pit accumulates 1/round
        occupations: ['farm-hand-b085'],
        farmyard: {
          fields: [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
  })
})
