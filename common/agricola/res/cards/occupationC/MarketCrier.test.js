const t = require('../../../testutil_v2.js')

describe('Market Crier', () => {
  test('offers bonus grain and vegetable on Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['market-crier-c142'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Get 1 grain and 1 vegetable (others get 1 grain)')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 2,
        vegetables: 1,
        occupations: ['market-crier-c142'],
      },
    })
  })
})
