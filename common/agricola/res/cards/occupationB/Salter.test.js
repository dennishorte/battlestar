const t = require('../../../testutil_v2.js')


describe('Salter', () => {
  test('pay 1 sheep → 1 food/round for 3 rounds', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['salter-b157'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const sheepAction = actions.find(a => a.cardName === 'Salter' && a.actionArg === 'sheep')
    expect(sheepAction).toBeDefined()

    t.anytimeAction(game, sheepAction)

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['salter-b157'],
        animals: { sheep: 1 }, // 2 - 1 paid
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
        scheduled: {
          food: { 3: 1, 4: 1, 5: 1 }, // round 2 + 1..3 = rounds 3,4,5
        },
      },
    })
  })

  test('pay 1 cattle → 1 food/round for 7 rounds', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['salter-b157'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], cattle: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cattleAction = actions.find(a => a.cardName === 'Salter' && a.actionArg === 'cattle')
    expect(cattleAction).toBeDefined()

    t.anytimeAction(game, cattleAction)

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['salter-b157'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
        scheduled: {
          food: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 },
        },
      },
    })
  })

  test('not available without animals', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['salter-b157'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Salter')).toBe(false)
  })
})
