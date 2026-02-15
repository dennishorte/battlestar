const t = require('../../../testutil_v2.js')

describe('Tea House', () => {
  test('2nd placement — skip and get food, then place worker later', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['tea-house-d053'],
      },
    })
    game.run()

    // Dennis turn 1: normal action
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')

    // Dennis turn 2: skip via Tea House
    t.choose(game, 'Skip placement (Tea House)')

    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // Dennis still has 1 worker — places it normally
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['tea-house-d053'],
        food: 1, // from Tea House skip
        wood: 3, // from Forest (round 6 accumulation)
        grain: 1,
      },
    })
  })

  test('once per round — not offered again same round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['tea-house-d053'],
      },
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')

    // Dennis turn 2: skip via Tea House
    t.choose(game, 'Skip placement (Tea House)')

    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // Dennis turn 3 (still has worker): Tea House should NOT be offered again
    expect(t.currentChoices(game)).not.toContain('Skip placement (Tea House)')
  })

  test('not offered on 1st placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['tea-house-d053'],
      },
    })
    game.run()

    // Dennis's first turn — Tea House not offered (person placed = 0, not 1)
    expect(t.currentChoices(game)).not.toContain('Skip placement (Tea House)')
  })
})
