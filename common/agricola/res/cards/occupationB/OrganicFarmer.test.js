const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Organic Farmer (B098)', () => {
  test('gives bonus points for pastures with spare capacity', () => {
    const card = res.getCardById('organic-farmer-b098')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPasturesWithSpareCapacity = jest.fn().mockReturnValue(2)

    const points = card.getEndGamePoints(dennis)

    expect(dennis.getPasturesWithSpareCapacity).toHaveBeenCalledWith(3)
    expect(points).toBe(2)
  })

  test('returns 0 when no pastures with spare capacity', () => {
    const card = res.getCardById('organic-farmer-b098')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPasturesWithSpareCapacity = jest.fn().mockReturnValue(0)

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })
})
