const t = require('../../../testutil_v2.js')


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

    t.anytimeAction(game, action)

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

  test('can activate immediately after playing from Meeting Place', () => {
    const game = t.fixture({ cardSets: ['minorB', 'test'] })
    t.setBoard(game, {
      round: 3,
      dennis: {
        hand: ['potters-market-b069'],
        workers: 1,
        wood: 2,
        clay: 5,
        food: 5,
      },
      micah: {
        workers: 0,
      },
    })
    game.run()

    // Dennis goes to Meeting Place and plays Potter's Market
    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Potter's Market")

    // After playing, the game should offer a prompt where anytime actions are available
    // Use the anytime action to activate Potter's Market
    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === "Potter's Market")
    expect(action).toBeDefined()
    t.anytimeAction(game, action)

    // End the prompt
    t.choose(game, 'End turn')

    t.testBoard(game, {
      dennis: {
        clay: 2, // 5 - 3
        food: 4, // 5 - 2 cost + 1 Meeting Place
        minorImprovements: ['potters-market-b069'],
        workers: 0,
        scheduled: {
          vegetables: { 4: 1, 5: 1 },
        },
      },
      micah: {
        workers: 0,
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
