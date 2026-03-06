const t = require('../../../testutil_v2.js')

describe('Elder', () => {
  test('can be played for free at start of round 1', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['elder-e096'],
      },
    })
    game.run()

    // Should be offered to play Elder for free
    t.choose(game, 'Yes')

    t.testBoard(game, {
      dennis: {
        hand: [],
        occupations: ['elder-e096'],
      },
    })
  })

  test('can decline to play Elder at start of round 1', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['elder-e096'],
      },
    })
    game.run()

    // Decline to play Elder
    t.choose(game, 'No')

    t.testBoard(game, {
      dennis: {
        hand: ['elder-e096'],
        occupations: [],
      },
    })
  })

  test('not offered in round 2', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 2,
      dennis: {
        hand: ['elder-e096'],
      },
    })
    game.run()

    // Should go straight to action selection (no Elder offer)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        hand: ['elder-e096'],
        food: 2,
      },
    })
  })

  test('no crash when already played', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['elder-e096'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        occupations: ['elder-e096'],
      },
    })
  })
})
