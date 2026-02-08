const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Housemaster (B153)', () => {
  test('gives 4 bonus points when major improvement total with smallest doubled is 11+', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([4, 3, 2]) // total 9 + 2 = 11

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(4)
  })

  test('gives 3 bonus points when total is 9-10', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([4, 3, 1]) // total 8 + 1 = 9

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(3)
  })

  test('gives 2 bonus points when total is 7-8', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([3, 2, 1]) // total 6 + 1 = 7

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(2)
  })

  test('gives 1 bonus point when total is 5-6', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([2, 2]) // total 4 + 2 = 6

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(1)
  })

  test('gives 0 points when total is less than 5', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([1, 1]) // total 2 + 1 = 3

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })

  test('gives 0 points when no major improvements', () => {
    const card = res.getCardById('housemaster-b153')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMajorImprovementValues = jest.fn().mockReturnValue([])

    const points = card.getEndGamePoints(dennis)

    expect(points).toBe(0)
  })
})
