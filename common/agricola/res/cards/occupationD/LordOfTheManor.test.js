const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lord of the Manor (OccD 100)', () => {
  test('gives bonus points equal to number of max score categories', () => {
    const card = res.getCardById('lord-of-the-manor-d100')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCategoriesWithMaxScore = () => 3

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(3)
  })

  test('gives 0 bonus points when no max score categories', () => {
    const card = res.getCardById('lord-of-the-manor-d100')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCategoriesWithMaxScore = () => 0

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })

  test('gives 5 bonus points when 5 max score categories', () => {
    const card = res.getCardById('lord-of-the-manor-d100')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCategoriesWithMaxScore = () => 5

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(5)
  })
})
