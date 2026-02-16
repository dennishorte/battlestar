const t = require('../../../testutil_v2.js')

describe('Collector', () => {
  // Card text: "This card is an action space for you only. When you use it,
  // you get 1 begging marker and 6/7/8/9 different goods."

  test('provides owner-only action space with goods and begging marker', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['collector-c104'],
      },
      micah: { food: 10 },
    })
    game.run()

    // Play Collector
    t.choose(game, 'Lessons A')
    t.choose(game, 'Collector')

    // Use Collector action space (1st use: 6 goods + 1 begging)
    t.choose(game, 'Forest')  // micah
    t.choose(game, 'Collector')  // dennis uses the action space

    // Choose 6 different goods
    t.choose(game, 'wood')
    t.choose(game, 'clay')
    t.choose(game, 'reed')
    t.choose(game, 'stone')
    t.choose(game, 'grain')
    t.choose(game, 'vegetables')

    t.testBoard(game, {
      dennis: {
        occupations: ['collector-c104'],
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        grain: 1,
        vegetables: 1,
        beggingCards: 1,
      },
    })
  })

  test('non-owner cannot use the action space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        hand: ['collector-c104'],
      },
      micah: { food: 10 },
    })
    game.run()

    // micah goes first — Collector not available to micah
    expect(t.currentChoices(game)).not.toContain('Collector')
  })
})
