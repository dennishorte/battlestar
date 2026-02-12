const t = require('../../../testutil_v2.js')

describe('Tasting', () => {
  test('offers grain-for-food exchange when using Lessons action space', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        grain: 1,
        minorImprovements: ['tasting-b063'],
      },
    })
    game.run()

    // Use Lessons A — Tasting offers exchange before occupation cost
    t.choose(game, 'Lessons A')
    t.choose(game, 'Exchange 1 grain for 4 food')
    // playOccupation auto-skips (no occupations in hand)

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        food: 4, // from Tasting exchange
        minorImprovements: ['tasting-b063'],
      },
    })
  })

  test('can decline the exchange', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        grain: 1,
        minorImprovements: ['tasting-b063'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Do not exchange')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        food: 0,
        minorImprovements: ['tasting-b063'],
      },
    })
  })

  test('does not trigger when player has no grain', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        grain: 0,
        minorImprovements: ['tasting-b063'],
      },
    })
    game.run()

    // Use Lessons A — no Tasting offer since no grain
    t.choose(game, 'Lessons A')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        food: 0,
        minorImprovements: ['tasting-b063'],
      },
    })
  })

  test('does not trigger on non-Lessons action spaces', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        grain: 1,
        minorImprovements: ['tasting-b063'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 2, // 1 starting + 1 from Grain Seeds
        food: 0,
        minorImprovements: ['tasting-b063'],
      },
    })
  })
})
