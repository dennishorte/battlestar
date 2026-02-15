const t = require('../../../testutil_v2.js')

describe('Small Animal Breeder', () => {
  // Card text: "Before the start of each round, if you have food equal to or
  // higher than the current round number, you get 1 food."

  test('gives 1 food when food >= round number', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['small-animal-breeder-c111'],
        food: 3,
      },
    })
    game.run()

    // Round 2 starts: food (3) >= round (2) → get 1 food → 4
    t.testBoard(game, {
      dennis: {
        occupations: ['small-animal-breeder-c111'],
        food: 4,
      },
    })
  })

  test('does not give food when food < round number', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['small-animal-breeder-c111'],
        food: 3,
      },
    })
    game.run()

    // Round 5 starts: food (3) < round (5) → no bonus
    t.testBoard(game, {
      dennis: {
        occupations: ['small-animal-breeder-c111'],
        food: 3,
      },
    })
  })
})
