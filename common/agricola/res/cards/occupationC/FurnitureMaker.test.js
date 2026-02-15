const t = require('../../../testutil_v2.js')

describe('Furniture Maker', () => {
  // Card text: "When you play this card, you immediately get 1 wood. Each time
  // you play an occupation after this one, you get 1 wood for each food paid
  // as occupation cost."

  test('onPlay gives 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['furniture-maker-c116'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Furniture Maker')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        occupations: ['furniture-maker-c116'],
      },
    })
  })

  test('gives wood when playing subsequent occupation', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['furniture-maker-c116', 'test-occupation-1'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: Play Furniture Maker (first occ, free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Furniture Maker')
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Grain Utilization')  // micah

    // Round 3: Play test-occupation-1 (second occ, costs 1 food)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        food: 9,  // 10 - 1 for occupation cost
        wood: 2,  // 1 from onPlay + 1 from playing occupation
        grain: 1,
        occupations: ['furniture-maker-c116', 'test-occupation-1'],
      },
    })
  })
})
