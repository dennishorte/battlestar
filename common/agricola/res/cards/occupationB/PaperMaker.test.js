const t = require('../../../testutil_v2.js')

describe('Paper Maker', () => {
  // Card text: "Immediately before playing each occupation after this one,
  // you can pay 1 wood total to get 1 food for each occupation you have
  // in front of you."
  // Uses onBeforePlayOccupation hook.

  test('pay 1 wood for food when playing second occupation', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['paper-maker-b109'],
        hand: ['test-occupation-1'],
        wood: 3,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    // dennis plays test-occupation-1 via Lessons A
    // Flow: select Lessons A → select occupation → onBeforePlayOccupation → pay cost
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // onBeforePlayOccupation fires: 1 occupation in front → pay 1 wood for 1 food
    t.choose(game, 'Pay 1 wood for 1 food')

    // wood: 3 - 1(PaperMaker) = 2
    // food: 5 + 1(PaperMaker) - 1(occupation cost) = 5
    t.testBoard(game, {
      dennis: {
        occupations: ['paper-maker-b109', 'test-occupation-1'],
        wood: 2,
        food: 5,
      },
    })
  })

  test('skip the wood payment', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['paper-maker-b109'],
        hand: ['test-occupation-1'],
        wood: 3,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    t.choose(game, 'Skip')

    // food: 5 - 1(occupation cost) = 4
    t.testBoard(game, {
      dennis: {
        occupations: ['paper-maker-b109', 'test-occupation-1'],
        wood: 3,
        food: 4,
      },
    })
  })

  test('not offered when player has no wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['paper-maker-b109'],
        hand: ['test-occupation-1'],
        wood: 0,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    // With 0 wood, Paper Maker should not offer the exchange
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    // food: 5 - 1(occupation cost) = 4
    t.testBoard(game, {
      dennis: {
        occupations: ['paper-maker-b109', 'test-occupation-1'],
        wood: 0,
        food: 4,
      },
    })
  })
})
