const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Loom (B039)', () => {
  test('gives food based on sheep count during harvest', () => {
    const card = res.getCardById('loom-b039')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => type === 'sheep' ? 5 : 0
    dennis.food = 0

    card.onHarvest(game, dennis)
    expect(dennis.food).toBe(2) // 4-6 sheep = 2 food
  })

  test('gives end game points based on sheep count', () => {
    const card = res.getCardById('loom-b039')
    const mockPlayer = {
      getTotalAnimals: (type) => type === 'sheep' ? 7 : 0,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(2) // 7/3 = 2
  })
})
