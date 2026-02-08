const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Full Farmer (OccA 134)', () => {
  test('gives 1 wood and 1 clay on play', () => {
    const card = res.getCardById('full-farmer-a134')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(1)
  })

  test('gives points equal to full pasture count', () => {
    const card = res.getCardById('full-farmer-a134')
    const mockPlayer = { getFullPastureCount: () => 3 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(3)
  })

  test('gives 0 points with no full pastures', () => {
    const card = res.getCardById('full-farmer-a134')
    const mockPlayer = { getFullPastureCount: () => 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
