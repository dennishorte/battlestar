const t = require('../../../testutil_v2.js')

describe('Forest Guardian', () => {
  // Card text: "When you play this card, you immediately get 2 wood. Each time
  // before another player takes at least 5 wood from an accumulation space,
  // they must first pay you 1 food."
  // Card is 3+ players.

  test('onPlay gives 2 wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['forest-guardian-b138'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Forest Guardian')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-guardian-b138'],
        wood: 2,
      },
    })
  })

  test('other player taking 5+ wood from Forest pays 1 food to owner', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 0,
      },
      micah: {
        food: 3,
      },
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
    })
    game.run()

    // micah takes Forest with 6 wood (≥5) → pays 1 food to dennis
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 1,  // received 1 food from micah
      },
      micah: {
        food: 2,  // 3 - 1 paid to dennis
        wood: 6,
      },
    })
  })

  test('other player taking less than 5 wood does not trigger', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 0,
      },
      micah: {
        food: 3,
      },
      actionSpaces: [{ ref: 'Forest', accumulated: 3 }],
    })
    game.run()

    // micah takes Forest with 3 wood (<5) → no trigger
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 0,  // no food received
      },
      micah: {
        food: 3,  // no food paid
        wood: 3,
      },
    })
  })

  test('card owner taking wood does not trigger', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 2,
        wood: 0,
      },
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
    })
    game.run()

    // dennis (owner) takes Forest with 6 wood → no self-trigger
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 2,  // unchanged
        wood: 6,
      },
    })
  })

  test('does not trigger when other player has 0 food', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 0,
      },
      micah: {
        food: 0,
      },
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
    })
    game.run()

    // micah takes Forest with 6 wood (≥5), but has 0 food → cannot pay
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-guardian-b138'],
        food: 0,  // no food received
      },
      micah: {
        food: 0,
        wood: 6,
      },
    })
  })
})
