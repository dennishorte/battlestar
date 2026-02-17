const t = require('../../../testutil_v2.js')

describe('Lodger', () => {
  test('providesRoom: can grow family before round 10 (extra room from Lodger)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    // Lodger provides 1 extra room until round 9
    // Dennis has 2 rooms + 1 Lodger = 3 capacity, 2 family → can grow
    expect(t.currentChoices(game)).toContain('Basic Wish for Children')
  })

  test('providesRoomUntilRound: cannot grow family after round 9 (room expired)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    // After round 9, Lodger no longer provides the extra room
    // Dennis has 2 rooms, 2 family → cannot grow
    expect(t.currentChoices(game)).not.toContain('Basic Wish for Children')
  })

  test('providesRoom: in round 9 still provides room', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 9,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    // Round 9 is the last round Lodger provides the room
    // Dennis has 2 rooms + 1 Lodger = 3 capacity, 2 family → can grow
    expect(t.currentChoices(game)).toContain('Basic Wish for Children')
  })
})
