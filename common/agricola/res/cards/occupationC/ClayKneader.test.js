const t = require('../../../testutil_v2.js')

describe('Clay Kneader', () => {
  // Card text: "When you play this card, you immediately get 1 wood and 2 clay.
  // Each time after you use a Grain Seeds or Vegetable Seeds action space,
  // you get 1 clay."

  test('onPlay gives 1 wood and 2 clay', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-kneader-c121'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Kneader')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        clay: 2,
        occupations: ['clay-kneader-c121'],
      },
    })
  })

  test('gives 1 clay when taking Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-kneader-c121'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Kneader')
    t.choose(game, 'Day Laborer')  // micah

    // Dennis takes Grain Seeds — gets 1 grain + 1 clay from Clay Kneader
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        clay: 3,  // 2 from onPlay + 1 from onAction
        grain: 1,
        occupations: ['clay-kneader-c121'],
      },
    })
  })
})
