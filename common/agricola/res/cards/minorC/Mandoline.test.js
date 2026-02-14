const t = require('../../../testutil_v2.js')


describe('Mandoline', () => {
  test('pay 1 vegetable → 1 BP + schedule 1 food/round for 2 rounds', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['mandoline-c046'],
        vegetables: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Mandoline')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // 2 - 1
        food: 5,
        bonusPoints: 1,
        minorImprovements: ['mandoline-c046'],
        scheduled: {
          food: { 3: 1, 4: 1 },
        },
      },
    })
  })

  test('not available without vegetables', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['mandoline-c046'],
        vegetables: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Mandoline')).toBe(false)
  })
})
