const t = require('../../../testutil_v2.js')

describe('Agricultural Labourer', () => {
  // Card text: "Place 8 clay on this card. For each grain you obtain,
  // you also get 1 clay from this card."

  test('onPlay puts 8 clay on card', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['agricultural-labourer-c120'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Agricultural Labourer')

    const state = game.cardState('agricultural-labourer-c120')
    expect(state.clay).toBe(8)
  })

  test('gives clay when taking grain seeds', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['agricultural-labourer-c120'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: play Agricultural Labourer
    t.choose(game, 'Lessons A')
    t.choose(game, 'Agricultural Labourer')
    t.choose(game, 'Day Laborer')  // micah

    // Round 2: dennis takes Grain Seeds
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        clay: 1,
        occupations: ['agricultural-labourer-c120'],
      },
    })

    // Verify card state decreased
    const state = game.cardState('agricultural-labourer-c120')
    expect(state.clay).toBe(7)
  })
})
