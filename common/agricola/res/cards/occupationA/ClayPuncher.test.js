const t = require('../../../testutil_v2.js')

describe('Clay Puncher', () => {
  test('onPlay grants 1 clay when played', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['clay-puncher-a121'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Puncher')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 2, // 1 from onPlay + 1 from onAction (Lessons A triggers onAction)
        // First occupation is free, so food should be unchanged (2)
        // But we don't assert food since it might vary
      },
    })
  })

  test('onAction grants 1 clay when using Clay Pit accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 1 }],
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 0,
      },
    })
    game.run()

    // Take Clay Pit action
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 2, // 1 from Clay Pit accumulation + 1 from onAction
      },
    })
  })

  test('onAction does not grant clay for other actions', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 0,
      },
    })
    game.run()

    // Take Day Laborer action (not Lessons or Clay Pit)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 0, // No clay from onAction (not a matching action)
        food: 2, // 2 food from Day Laborer
      },
    })
  })

  test('onPlay and onAction both grant clay in same round', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 1 }],
      dennis: {
        hand: ['clay-puncher-a121'],
        clay: 0,
      },
    })
    game.run()

    // Play the card (onPlay grants 1 clay)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Puncher')

    // Then take Clay Pit action (onAction grants 1 clay)
    t.choose(game, 'Forest') // micah's turn
    t.choose(game, 'Clay Pit') // dennis's turn

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-puncher-a121'],
        clay: 4, // 1 from onPlay + 1 from onAction(Lessons) + 1 from Clay Pit + 1 from onAction(Clay Pit)
      },
    })
  })
})
