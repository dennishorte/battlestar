const t = require('../../../testutil_v2.js')

describe('Little Peasant', () => {
  // Card text: "You immediately get 1 stone. As long as you live in a wooden house
  // with exactly 2 rooms, action spaces - excluding Meeting Place - are not
  // considered occupied for you."
  // Card is 3+ players.

  test('onPlay gives 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['little-peasant-b151'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Little Peasant')

    t.testBoard(game, {
      dennis: {
        occupations: ['little-peasant-b151'],
        stone: 1,
      },
    })
  })

  test('with 2 wood rooms can use action space occupied by another player', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['little-peasant-b151'],
        // default 2 wood rooms
      },
    })
    game.run()

    // micah occupies Day Laborer
    t.choose(game, 'Day Laborer')
    // eliya (3rd player) takes a turn
    t.choose(game, 'Forest')

    // dennis should be able to use occupied Day Laborer
    expect(t.currentChoices(game)).toContain('Day Laborer')
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['little-peasant-b151'],
        food: 2,  // Day Laborer gives 2 food
      },
    })
  })

  test('cannot use occupied Meeting Place even with 2 wood rooms', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['little-peasant-b151'],
      },
    })
    game.run()

    // micah occupies Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, t.currentChoices(game)[0])  // respond to minor improvement prompt
    // eliya takes a turn
    t.choose(game, 'Forest')

    // dennis should NOT be able to use occupied Meeting Place
    expect(t.currentChoices(game)).not.toContain('Meeting Place')
  })

  test('with clay rooms cannot use occupied action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['little-peasant-b151'],
        roomType: 'clay',
      },
    })
    game.run()

    // micah occupies Day Laborer
    t.choose(game, 'Day Laborer')
    // eliya takes a turn
    t.choose(game, 'Forest')

    // dennis has clay rooms, ability should NOT apply
    expect(t.currentChoices(game)).not.toContain('Day Laborer')
  })

  test('with 3 wood rooms cannot use occupied action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['little-peasant-b151'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // micah occupies Day Laborer
    t.choose(game, 'Day Laborer')
    // eliya takes a turn
    t.choose(game, 'Forest')

    // dennis has 3 wood rooms, ability requires exactly 2
    expect(t.currentChoices(game)).not.toContain('Day Laborer')
  })
})
