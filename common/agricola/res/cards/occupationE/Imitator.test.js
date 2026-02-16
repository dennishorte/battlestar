const t = require('../../../testutil_v2.js')

describe('Imitator', () => {
  test('card can be played without crashing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['imitator-e129'],
      },
    })
    game.run()

    // Play Imitator
    t.choose(game, 'Lessons A')
    t.choose(game, 'Imitator')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['imitator-e129'],
      },
    })
  })

  test('allows using occupied non-accumulating round card when on Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['imitator-e129'],
      },
      micah: {
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // Dennis takes Day Laborer (places person there)
    t.choose(game, 'Day Laborer')

    // Micah takes Grain Utilization (occupies it) - no fields, so just skips sow/bake
    t.choose(game, 'Grain Utilization')

    // Dennis should be able to use Grain Utilization despite it being occupied
    // because Imitator allows ignoring occupied non-accumulating round 1-9 spaces
    // when the player has a person on Day Laborer
    expect(t.currentChoices(game)).toContain('Grain Utilization')
    t.choose(game, 'Grain Utilization')

    // Micah takes remaining action
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer gives 2 food
        occupations: ['imitator-e129'],
      },
    })
  })
})
