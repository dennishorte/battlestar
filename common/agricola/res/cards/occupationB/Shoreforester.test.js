const t = require('../../../testutil_v2.js')

describe('Shoreforester', () => {
  // Card text: "When you play this card, and each time 1 reed is placed on an
  // empty "Reed Bank" accumulation space in the preparation phase, you get 1 wood."

  test('onPlay gives 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['shoreforester-b116'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Shoreforester')

    t.testBoard(game, {
      dennis: {
        occupations: ['shoreforester-b116'],
        wood: 1,
      },
    })
  })

  test('gives 1 wood when Reed Bank is replenished from empty', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['shoreforester-b116'],
        wood: 0,
      },
    })
    game.run()

    // Round 2: Reed Bank replenishes 0→1 (was empty → Shoreforester: +1 wood)
    // Dennis takes Reed Bank to drain it back to 0
    t.choose(game, 'Reed Bank')    // dennis: takes 1 reed
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 3: Reed Bank replenishes 0→1 (was empty → Shoreforester: +1 wood)
    t.testBoard(game, {
      dennis: {
        occupations: ['shoreforester-b116'],
        wood: 2,  // +1 from r2 replenish + 1 from r3 replenish
        reed: 1,  // took 1 from Reed Bank r2
        food: 2,  // Day Laborer
      },
    })
  })

  test('does not give wood when Reed Bank is replenished from non-empty', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['shoreforester-b116'],
        wood: 0,
      },
    })
    game.run()

    // Round 2: Reed Bank replenishes 0→1 (was empty → +1 wood)
    // Nobody takes Reed Bank this round
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 3: Reed Bank replenishes 1→2 (was non-empty → NO wood)
    t.testBoard(game, {
      dennis: {
        occupations: ['shoreforester-b116'],
        wood: 1,  // only +1 from r2 (empty→1), not from r3 (1→2)
        food: 2,
        grain: 1,
      },
    })
  })
})
