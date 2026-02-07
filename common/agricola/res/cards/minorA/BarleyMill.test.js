const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Barley Mill (A064)', () => {
  test('gives food for each grain field at harvest', () => {
    const card = res.getCardById('barley-mill-a064')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = () => 3

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives no food when no grain fields', () => {
    const card = res.getCardById('barley-mill-a064')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = () => 0

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('barley-mill-a064')
    expect(card.cost).toEqual({ wood: 1, clay: 4 })
    expect(card.costAlternative).toEqual({ wood: 1, stone: 2 })
    expect(card.vps).toBe(1)
  })
})
