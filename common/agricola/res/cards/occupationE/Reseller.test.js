const t = require('../../../testutil_v2.js')

describe('Reseller', () => {
  test('refunds printed cost after building a major improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        hand: ['reseller-e146'],
        clay: 5,
        food: 1, // for occupation cost
      },
    })
    game.run()

    // Round: dennis has 2 workers, micah has 2 workers = 4 actions total
    t.choose(game, 'Lessons A')     // dennis
    t.choose(game, 'Reseller')      // select occupation
    t.choose(game, 'Day Laborer')   // micah
    // dennis: Major Improvement action
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    // Reseller fires: refund printed cost
    t.choose(game, 'Get 2 clay from supply')

    t.testBoard(game, {
      dennis: {
        clay: 5,  // 5 - 2 (pay) + 2 (refund) = 5
        food: 1,  // first occ via Lessons A is free
        occupations: ['reseller-e146'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can only be used once per game', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        hand: ['reseller-e146'],
        clay: 10,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')     // dennis
    t.choose(game, 'Reseller')
    t.choose(game, 'Day Laborer')   // micah
    t.choose(game, 'Major Improvement')  // dennis
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Use Reseller
    t.choose(game, 'Get 2 clay from supply')
    t.choose(game, 'Clay Pit')     // micah

    // Verify Reseller was used
    expect(game.cardState('reseller-e146').used).toBe(true)

    t.testBoard(game, {
      dennis: {
        clay: 10,  // 10 - 2 + 2 = 10
        food: 1,   // first occ via Lessons A is free
        occupations: ['reseller-e146'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can skip the refund', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        hand: ['reseller-e146'],
        clay: 5,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')     // dennis
    t.choose(game, 'Reseller')
    t.choose(game, 'Day Laborer')   // micah
    t.choose(game, 'Major Improvement')  // dennis
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Skip the refund
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        clay: 3,  // 5 - 2 (pay), no refund
        food: 1,  // first occ via Lessons A is free
        occupations: ['reseller-e146'],
        majorImprovements: ['fireplace-2'],
      },
    })

    // Reseller not used — still available for future
    expect(game.cardState('reseller-e146').used).toBe(false)
  })
})
