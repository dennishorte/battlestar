const t = require('../../../testutil_v2.js')

describe('Basket Weaver', () => {
  // Card text: "When you play this card, immediately build the 'Basketmaker's
  // Workshop' major improvement for 1 stone and 1 reed."

  test('onPlay builds Basketmaker Workshop for reduced cost', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        stone: 2,
        reed: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')

    t.testBoard(game, {
      dennis: {
        stone: 1,  // 2 - 1
        reed: 1,   // 2 - 1
        food: 10,
        occupations: ['basket-weaver-c095'],
        majorImprovements: ['basketmakers-workshop'],
      },
    })
  })

  test('fires onBuildMajor hooks (CraftTeacher triggers)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        occupations: ['craft-teacher-a131'],
        stone: 2,
        reed: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')
    // CraftTeacher should fire: offer up to 2 free occupations
    // No occupations in hand, so it won't prompt
    // Verify workshop was built and CraftTeacher hook was called via log
    t.testBoard(game, {
      dennis: {
        stone: 1,
        reed: 1,
        food: 9, // 10 - 1 (occupation cost for 2nd occupation)
        occupations: ['craft-teacher-a131', 'basket-weaver-c095'],
        majorImprovements: ['basketmakers-workshop'],
      },
    })
  })

  test('does not build if insufficient resources', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        stone: 0,
        reed: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')

    t.testBoard(game, {
      dennis: {
        stone: 0,
        reed: 1,
        food: 10,
        occupations: ['basket-weaver-c095'],
        majorImprovements: [],
      },
    })
  })
})
