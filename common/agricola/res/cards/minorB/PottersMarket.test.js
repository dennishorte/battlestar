const t = require('../../../testutil_v2.js')

function respondAnytimeAction(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

describe("Potter's Market", () => {
  test('pay 3 clay + 2 food → schedule 1 vegetable/round for 2 rounds', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['potters-market-b069'],
        clay: 5,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === "Potter's Market")
    expect(action).toBeDefined()

    respondAnytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        clay: 2, // 5 - 3
        food: 3, // 5 - 2
        minorImprovements: ['potters-market-b069'],
        scheduled: {
          vegetables: { 3: 1, 4: 1 },
        },
      },
    })
  })

  test('not available with insufficient clay', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potters-market-b069'],
        clay: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === "Potter's Market")).toBe(false)
  })

  test('not available with insufficient food', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potters-market-b069'],
        clay: 5,
        food: 1,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === "Potter's Market")).toBe(false)
  })
})
