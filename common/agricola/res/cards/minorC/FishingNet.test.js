const t = require('../../../testutil_v2.js')

describe('Fishing Net', () => {
  test('other player pays 1 food to owner when using Fishing', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['fishing-net-c051'],
        food: 5,
      },
      micah: {
        food: 5,
      },
    })
    game.run()

    // Micah uses Fishing (accumulation: 2 food in round 2) → pays 1 food to Dennis
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 6, // 5 + 1 (from Micah's Fishing payment)
        minorImprovements: ['fishing-net-c051'],
      },
      micah: {
        food: 5, // 5 - 1 (paid to Dennis) + 1 (from Fishing, 1 accumulated in round 2)
      },
    })
  })

  test('owner does not pay themselves when using Fishing', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['fishing-net-c051'],
        food: 5,
      },
      micah: {
        food: 5,
      },
    })
    game.run()

    // Dennis uses Fishing himself → no payment to self
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 6, // 5 + 1 (from Fishing, 1 accumulated in round 2, no self-payment)
        minorImprovements: ['fishing-net-c051'],
      },
    })
  })
})
