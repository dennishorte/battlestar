const t = require('../../../testutil_v2.js')

describe('Stock Protector', () => {
  // Card text: "Each time before you use the 'Fencing' action space, you
  // get 2 wood. Immediately after that 'Fencing' action, you can place
  // another person."
  // Card is 1+ players.

  test('Fencing gives 2 wood before the action', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stock-protector-b094'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    // Stock Protector gave 2 wood, but still cancel fencing for simplicity
    t.choose(game, 'Cancel fencing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 2,  // 0 + 2 from Stock Protector
        occupations: ['stock-protector-b094'],
      },
    })
  })

  test('after Fencing, offers to place another person', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stock-protector-b094'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.choose(game, 'Cancel fencing')
    // Accept extra person — take Day Laborer
    t.choose(game, 'Place another person')
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        wood: 2,   // 0 + 2 from Stock Protector
        food: 2,   // from Day Laborer
        occupations: ['stock-protector-b094'],
      },
    })
  })

  test('player can skip the extra person', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stock-protector-b094'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.choose(game, 'Cancel fencing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 2,
        occupations: ['stock-protector-b094'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stock-protector-b094'],
        wood: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        wood: 5,  // unchanged
        food: 2,
        occupations: ['stock-protector-b094'],
      },
    })
  })
})
