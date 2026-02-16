const t = require('../../../testutil_v2.js')

describe('Retail Dealer', () => {
  test('onPlay places 3 grain and 3 food on card', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['retail-dealer-d156'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Retail Dealer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['retail-dealer-d156'],
      },
    })

    // Verify card state
    const cardState = game.cardState('retail-dealer-d156')
    expect(cardState.grain).toBe(3)
    expect(cardState.food).toBe(3)
  })

  test('gives 1 grain and 1 food from card when using Resource Market', () => {
    const game = t.fixture({ cardSets: ['occupationD'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['retail-dealer-d156'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const s = game.cardState('retail-dealer-d156')
      s.grain = 3
      s.food = 3
    })
    game.run()

    // Dennis uses Resource Market: base gives 1 food + choice of reed/stone
    // Retail Dealer onAction triggers: +1 grain, +1 food from card
    t.choose(game, 'Resource Market')
    t.choose(game, game.waiting.selectors[0].choices[0]) // choose reed or stone

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,   // 1 from Resource Market + 1 from Retail Dealer
        grain: 1,  // from Retail Dealer
        reed: 1,   // from Resource Market choice (reed or stone)
        occupations: ['retail-dealer-d156'],
      },
    })

    // Verify card state decremented
    const cardState = game.cardState('retail-dealer-d156')
    expect(cardState.grain).toBe(2)
    expect(cardState.food).toBe(2)
  })

  test('does not trigger on non-resource-market actions', () => {
    const game = t.fixture({ cardSets: ['occupationD'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['retail-dealer-d156'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const s = game.cardState('retail-dealer-d156')
      s.grain = 3
      s.food = 3
    })
    game.run()

    // Dennis uses Day Laborer (not Resource Market)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // only from Day Laborer, no Retail Dealer bonus
        grain: 0,
        occupations: ['retail-dealer-d156'],
      },
    })

    // Verify card state unchanged
    const cardState = game.cardState('retail-dealer-d156')
    expect(cardState.grain).toBe(3)
    expect(cardState.food).toBe(3)
  })
})
