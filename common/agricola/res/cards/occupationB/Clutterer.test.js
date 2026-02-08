const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clutterer (B100)', () => {
  test('gives bonus points for cards with "accumulation space" in text played after this one', () => {
    const card = res.getCardById('clutterer-b100')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCardsWithTextPlayedAfter = jest.fn().mockReturnValue(3)

    const points = card.getEndGamePoints(dennis)

    expect(dennis.getCardsWithTextPlayedAfter).toHaveBeenCalledWith('clutterer-b100', 'accumulation space')
    expect(points).toBe(3)
  })

  test('returns 0 when no cards played after with matching text', () => {
    const card = res.getCardById('clutterer-b100')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCardsWithTextPlayedAfter = jest.fn().mockReturnValue(0)

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })
})
