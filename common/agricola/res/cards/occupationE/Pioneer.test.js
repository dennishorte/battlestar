const t = require('../../../testutil_v2.js')

describe('Pioneer', () => {
  test('gives 1 building resource and 1 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pioneer-e105'],
      },
    })
    game.run()

    // Play Pioneer via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Pioneer')
    // onPlay fires: choose a building resource
    t.choose(game, '1 wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        food: 1, // from Pioneer
        occupations: ['pioneer-e105'],
      },
    })
  })

  test('can choose clay on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pioneer-e105'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Pioneer')
    t.choose(game, '1 clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,
        food: 1,
        occupations: ['pioneer-e105'],
      },
    })
  })

  test('can choose reed on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pioneer-e105'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Pioneer')
    t.choose(game, '1 reed')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 1,
        food: 1,
        occupations: ['pioneer-e105'],
      },
    })
  })

  test('triggers before using the most recent action space', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market', 'Fencing', 'Grain Utilization', 'Major Improvement'],
      dennis: {
        occupations: ['pioneer-e105'],
        food: 8, // enough for harvest
      },
      micah: { food: 8 },
    })
    game.run()

    // Round 4: Major Improvement is revealed (last specified action space)
    // getMostRecentlyRevealedRound() = 4
    // getActionSpaceRound('major-minor-improvement') = 4
    // Dennis uses Major Improvement — onBeforeAction fires Pioneer
    t.choose(game, 'Major Improvement')
    // Pioneer fires: choose building resource
    t.choose(game, '1 stone')
    // Major Improvement: no affordable improvements, auto-skips

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        stone: 1, // from Pioneer
        food: 9, // 8 + 1 from Pioneer
        occupations: ['pioneer-e105'],
      },
    })
  })

  test('does not trigger for non-most-recent action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pioneer-e105'],
      },
    })
    game.run()

    // Forest is a base action (not a round card), so Pioneer should NOT fire
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3, // from Forest only, no Pioneer bonus
        food: 0, // no Pioneer food
        occupations: ['pioneer-e105'],
      },
    })
  })
})
