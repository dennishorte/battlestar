const t = require('../../../testutil_v2.js')

describe('Resource Analyzer', () => {
  // Card text: "Before the start of each round, if you have more building
  // resources than all other players of at least two types, you get 1 food."

  test('gives 1 food when leading in 2+ building resource types', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['resource-analyzer-c157'],
        wood: 5,
        clay: 4,
        food: 0,
      },
      micah: { wood: 3, clay: 3 },
    })
    game.run()

    // Round 2 starts: dennis leads in wood (5>3) and clay (4>3) → get 1 food
    t.testBoard(game, {
      dennis: {
        occupations: ['resource-analyzer-c157'],
        wood: 5,
        clay: 4,
        food: 1,
      },
    })
  })

  test('does not give food when leading in only 1 type', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['resource-analyzer-c157'],
        wood: 5,
        clay: 2,
        food: 0,
      },
      micah: { wood: 3, clay: 3 },
    })
    game.run()

    // Round 2 starts: dennis leads in wood only (clay 2 < micah's 3) → no bonus
    t.testBoard(game, {
      dennis: {
        occupations: ['resource-analyzer-c157'],
        wood: 5,
        clay: 2,
        food: 0,
      },
    })
  })
})
