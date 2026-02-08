const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tutor (B099)', () => {
  test('gives bonus points for occupations played after this one', () => {
    const card = res.getCardById('tutor-b099')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationsPlayedAfter = jest.fn().mockReturnValue(4)

    const points = card.getEndGamePoints(dennis)

    expect(dennis.getOccupationsPlayedAfter).toHaveBeenCalledWith('tutor-b099')
    expect(points).toBe(4)
  })

  test('returns 0 when no occupations played after', () => {
    const card = res.getCardById('tutor-b099')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationsPlayedAfter = jest.fn().mockReturnValue(0)

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })
})
