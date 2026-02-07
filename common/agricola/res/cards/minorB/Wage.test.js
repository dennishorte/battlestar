const t = require('../../../testutil.js')

describe('Wage (B007)', () => {
  test('gives 2 food base', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 0,
        hand: ['wage-b007'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'wage-b007')

    const dennis = t.player(game)
    expect(dennis.food).toBe(2)
  })

  test('gives extra food for bottom row majors', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 0,
        hand: ['wage-b007'],
        majorImprovements: ['clay-oven', 'pottery'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'wage-b007')

    const dennis = t.player(game)
    // 2 base + 2 for 2 bottom row majors
    expect(dennis.food).toBe(4)
  })
})
