const t = require('../../../testutil_v2.js')

describe('Job Contract', () => {
  test('both spaces free — combined action available, executes both', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['job-contract-c023'],
        hand: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis turn 1: use Job Contract (Day Laborer + Lessons)
    t.choose(game, 'Day Laborer + Lessons (Job Contract)')
    // Lessons asks which occupation to play
    t.choose(game, 'Test Occupation 1')

    // Micah turn 1
    t.choose(game, 'Forest')
    // Dennis turn 2
    t.choose(game, 'Clay Pit')
    // Micah turn 2
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['job-contract-c023'],
        occupations: ['test-occupation-1'],
        food: 2, // from Day Laborer
        clay: 1, // from Clay Pit
      },
    })
  })

  test('Day Laborer occupied — not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['job-contract-c023'],
        hand: ['test-occupation-1'],
      },
    })
    game.run()

    // Micah takes Day Laborer first
    t.choose(game, 'Day Laborer')

    // Dennis's turn — Job Contract not available since Day Laborer is occupied
    expect(t.currentChoices(game)).not.toContain('Day Laborer + Lessons (Job Contract)')
  })

  test('Lessons occupied — not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['job-contract-c023'],
        hand: ['test-occupation-1'],
      },
      micah: {
        hand: ['test-occupation-2'],
      },
    })
    game.run()

    // Micah takes Lessons first
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 2')

    // Dennis's turn — Job Contract not available since Lessons is occupied
    expect(t.currentChoices(game)).not.toContain('Day Laborer + Lessons (Job Contract)')
  })
})
