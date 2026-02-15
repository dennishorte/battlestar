const t = require('../../../testutil_v2.js')

describe('Illusionist', () => {
  // Card text: "Each time you use a building resource accumulation space,
  // you can discard exactly 1 card from your hand to get 1 additional
  // building resource of the accumulating type."
  // Card is 3+ players. Building resources = wood, clay, stone, reed.

  test('Forest: discard 1 card for +1 wood', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['illusionist-b146'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Discard 1 card for 1 wood')
    // Only 1 card in hand — auto-selected

    t.testBoard(game, {
      dennis: {
        wood: 4,  // 3 from Forest + 1 bonus
        occupations: ['illusionist-b146'],
      },
    })
  })

  test('Clay Pit: discard 1 card for +1 clay', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['illusionist-b146'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')
    t.choose(game, 'Discard 1 card for 1 clay')

    t.testBoard(game, {
      dennis: {
        clay: 2,  // 1 from Clay Pit + 1 bonus
        occupations: ['illusionist-b146'],
      },
    })
  })

  test('player can skip the discard offer', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['illusionist-b146'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        hand: ['test-minor-1'],
        occupations: ['illusionist-b146'],
      },
    })
  })

  test('no offer when hand is empty', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['illusionist-b146'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // No discard offer — hand is empty

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['illusionist-b146'],
      },
    })
  })

  test('does not trigger on non-building-resource actions', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['illusionist-b146'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        hand: ['test-minor-1'],
        occupations: ['illusionist-b146'],
      },
    })
  })
})
