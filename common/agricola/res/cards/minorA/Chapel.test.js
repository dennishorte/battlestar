const t = require('../../../testutil_v2.js')

describe('Chapel', () => {
  test('owner uses Chapel action space and gets 3 bonus points', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['chapel-a039'],
      },
    })
    game.run()

    t.choose(game, 'Chapel')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['chapel-a039'],
        bonusPoints: 3,
      },
    })
  })

  test('non-owner uses Chapel, pays 1 grain to owner, gets 3 bonus points', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['chapel-a039'],
      },
      micah: {
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Chapel')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['chapel-a039'],
        grain: 1,
      },
      micah: {
        grain: 1,
        bonusPoints: 3,
      },
    })
  })

  test('non-owner without grain cannot use Chapel', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['chapel-a039'],
      },
      micah: {
        grain: 0,
      },
    })
    game.run()

    expect(t.currentChoices(game)).not.toContain('Chapel')
  })
})
