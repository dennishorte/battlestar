const t = require('../../../testutil_v2.js')

describe('Water Worker', () => {
  test('gives 1 reed when using Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['water-worker-d144'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,  // from Fishing (1 accumulated)
        reed: 1,  // from Water Worker
        occupations: ['water-worker-d144'],
      },
    })
  })

  test('gives 1 reed when using Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['water-worker-d144'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,  // from Day Laborer
        reed: 1,  // from Water Worker
        occupations: ['water-worker-d144'],
      },
    })
  })

  test('gives 1 reed when using Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['water-worker-d144'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 2,  // 1 from Reed Bank (accumulated) + 1 from Water Worker
        occupations: ['water-worker-d144'],
      },
    })
  })

  test('does not give reed for unrelated action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['water-worker-d144'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,  // from Forest (accumulated)
        reed: 0,  // no Water Worker bonus
        occupations: ['water-worker-d144'],
      },
    })
  })

  test('gives 1 reed when using the Round 4 action space', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['water-worker-d144'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Find out what the round 4 card is
    const round4Card = game.state.roundCardDeck[3]
    const round4Name = round4Card.name

    // Use the round 4 action space
    t.choose(game, round4Name)

    // Verify Water Worker bonus reed was given
    const dennis = game.players.byName('dennis')
    expect(dennis.reed).toBe(1)
  })
})
