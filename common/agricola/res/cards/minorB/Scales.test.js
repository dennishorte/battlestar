const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Scales (B049)', () => {
  test('gives 2 food on improvement when counts match', () => {
    const card = res.getCardById('scales-b049')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getImprovementCount = jest.fn().mockReturnValue(2)
    dennis.occupationsPlayed = 2

    card.onBuildImprovement(game, dennis)

    expect(dennis.food).toBe(2)
  })

  test('does not give food on improvement when counts differ', () => {
    const card = res.getCardById('scales-b049')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getImprovementCount = jest.fn().mockReturnValue(3)
    dennis.occupationsPlayed = 2

    card.onBuildImprovement(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('gives 2 food on occupation when counts match', () => {
    const card = res.getCardById('scales-b049')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getImprovementCount = jest.fn().mockReturnValue(3)
    dennis.occupationsPlayed = 3

    card.onPlayOccupation(game, dennis)

    expect(dennis.food).toBe(2)
  })

  test('does not give food on occupation when counts differ', () => {
    const card = res.getCardById('scales-b049')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getImprovementCount = jest.fn().mockReturnValue(2)
    dennis.occupationsPlayed = 3

    card.onPlayOccupation(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('requires no occupations', () => {
    const card = res.getCardById('scales-b049')
    expect(card.prereqs.noOccupations).toBe(true)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('scales-b049')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
