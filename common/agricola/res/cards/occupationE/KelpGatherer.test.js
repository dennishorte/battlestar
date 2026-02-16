const t = require('../../../testutil_v2.js')

describe('Kelp Gatherer', () => {
  test('gives 1 vegetable to owner and 1 extra food to fisher when opponent uses Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['kelp-gatherer-e160'],
      },
    })
    game.run()

    t.choose(game, 'Fishing') // micah takes Fishing (1 accumulated)

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // from Kelp Gatherer
        occupations: ['kelp-gatherer-e160'],
      },
      micah: {
        food: 2, // 1 from Fishing + 1 from Kelp Gatherer
      },
    })
  })

  test('does not trigger when owner uses Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['kelp-gatherer-e160'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        vegetables: 0,
        food: 1, // just normal Fishing (1 accumulated)
        occupations: ['kelp-gatherer-e160'],
      },
    })
  })
})
