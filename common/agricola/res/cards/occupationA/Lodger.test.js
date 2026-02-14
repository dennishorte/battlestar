const t = require('../../../testutil_v2.js')

describe('Lodger', () => {
  test('providesRoom: room count includes Lodger before round 10', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 8,
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getRoomCount()).toBe(3)
  })

  test('providesRoomUntilRound: room no longer provided after round 9', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 10,
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getRoomCount()).toBe(2)
  })

  test('providesRoom: in round 9 still counts', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 9,
      dennis: {
        occupations: ['lodger-a127'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getRoomCount()).toBe(3)
  })
})
