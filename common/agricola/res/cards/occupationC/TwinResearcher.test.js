const t = require('../../../testutil_v2.js')

describe('Twin Researcher', () => {
  // Card text: "Each time you use one of the two accumulation spaces for
  // the same type of good containing exactly the same number of goods,
  // you can also buy 1 bonus point for 1 food."
  // Only matching pair in engine: take-stone-1 (Western Quarry) and take-stone-2 (Eastern Quarry)

  test('buys 1 BP for 1 food when both quarries have same amount', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        { ref: 'Western Quarry', accumulated: 2 },
        'Vegetable Seeds', 'Pig Market',
        { ref: 'Eastern Quarry', accumulated: 2 },
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['twin-researcher-c154'],
        food: 3,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    // dennis takes Western Quarry (2 stone); Eastern Quarry also has 2 → offer BP
    t.choose(game, 'Western Quarry')
    t.choose(game, 'Buy 1 bonus point for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['twin-researcher-c154'],
        stone: 2,
        food: 2,  // 3 - 1(BP)
        bonusPoints: 1,
      },
    })
  })

  test('no offer when quarries have different amounts', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        { ref: 'Western Quarry', accumulated: 3 },
        'Vegetable Seeds', 'Pig Market',
        { ref: 'Eastern Quarry', accumulated: 1 },
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['twin-researcher-c154'],
        food: 3,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    // dennis takes Western Quarry (3 stone); Eastern Quarry has 1 → no offer
    t.choose(game, 'Western Quarry')

    // Next player's turn — no BP prompt appeared
    t.testBoard(game, {
      dennis: {
        occupations: ['twin-researcher-c154'],
        stone: 3,
        food: 3,
        bonusPoints: 0,
      },
    })
  })

  test('no offer when food < 1', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        { ref: 'Western Quarry', accumulated: 2 },
        'Vegetable Seeds', 'Pig Market',
        { ref: 'Eastern Quarry', accumulated: 2 },
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['twin-researcher-c154'],
        food: 0,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    // dennis takes Western Quarry but has no food → no offer
    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['twin-researcher-c154'],
        stone: 2,
        food: 0,
        bonusPoints: 0,
      },
    })
  })
})
