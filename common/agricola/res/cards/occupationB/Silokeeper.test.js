const t = require('../../../testutil_v2.js')

describe('Silokeeper', () => {
  test('triggers when using pre-harvest action space after harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Sheep Market is round 4 (last of 4 action spaces)
      actionSpaces: ['Grain Utilization', 'Fencing', 'Major Improvement', 'Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['silokeeper-b112'],
      },
    })
    // Set lastHarvestRound = 4 so Silokeeper sees harvest at round 4
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.lastHarvestRound = 4
    })
    game.run()

    // Round 5: Dennis takes Sheep Market (revealed in round 4, the pre-harvest round)
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        grain: 1, // from Silokeeper
        pet: 'sheep',
        animals: { sheep: 1 },
        occupations: ['silokeeper-b112'],
      },
    })
  })

  test('does not trigger for non-matching action space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Fencing', 'Major Improvement', 'Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['silokeeper-b112'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.lastHarvestRound = 4
    })
    game.run()

    // Dennis takes Day Laborer (base action, not a round card) — Silokeeper should not trigger
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        grain: 0,
        food: 2, // from Day Laborer
        occupations: ['silokeeper-b112'],
      },
    })
  })

  test('does not trigger before any harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Fencing', 'Major Improvement', 'Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['silokeeper-b112'],
      },
    })
    game.run()

    // No harvest has occurred (lastHarvestRound defaults to 0)
    // Dennis takes Sheep Market — Silokeeper should not trigger
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        grain: 0,
        pet: 'sheep',
        animals: { sheep: 1 },
        occupations: ['silokeeper-b112'],
      },
    })
  })
})
