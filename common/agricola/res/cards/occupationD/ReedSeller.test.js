const t = require('../../../testutil_v2.js')

describe('Reed Seller', () => {
  test('convert 1 reed to 3 food when no buyer', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['reed-seller-d159'],
        reed: 3,
      },
      micah: {
        food: 1,  // can't afford 2 food to buy
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Reed Seller')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        reed: 2,   // 3 - 1
        food: 3,   // 0 + 3
        occupations: ['reed-seller-d159'],
      },
      micah: {
        food: 1,
      },
    })
  })

  test('other player buys reed for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['reed-seller-d159'],
        reed: 3,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Reed Seller')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)
    t.choose(game, 'Buy reed for 2 food')

    t.testBoard(game, {
      dennis: {
        reed: 2,   // 3 - 1
        food: 2,   // 0 + 2 from sale
        occupations: ['reed-seller-d159'],
      },
      micah: {
        food: 2,   // 4 - 2
        reed: 1,   // 0 + 1
      },
    })
  })

  test('other player passes on buying', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['reed-seller-d159'],
        reed: 3,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Reed Seller')

    t.anytimeAction(game, action)
    t.choose(game, 'Pass')

    t.testBoard(game, {
      dennis: {
        reed: 2,   // 3 - 1
        food: 3,   // 0 + 3
        occupations: ['reed-seller-d159'],
      },
      micah: {
        food: 4,   // unchanged
      },
    })
  })

  test('not available without reed', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['reed-seller-d159'],
        reed: 0,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Reed Seller')).toBe(false)
  })
})
