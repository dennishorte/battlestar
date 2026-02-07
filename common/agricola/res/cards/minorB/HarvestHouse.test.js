const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Harvest House (B071)', () => {
  test('gives resources when harvests equals occupations played', () => {
    const card = res.getCardById('harvest-house-b071')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0
    dennis.vegetables = 0
    dennis.occupationsPlayed = 2
    game.getCompletedHarvestCount = jest.fn().mockReturnValue(2)

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.grain).toBe(1)
    expect(dennis.vegetables).toBe(1)
  })

  test('gives nothing when harvests does not equal occupations', () => {
    const card = res.getCardById('harvest-house-b071')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0
    dennis.vegetables = 0
    dennis.occupationsPlayed = 3
    game.getCompletedHarvestCount = jest.fn().mockReturnValue(2)

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(0)
    expect(dennis.grain).toBe(0)
    expect(dennis.vegetables).toBe(0)
  })

  test('has 2 VPs', () => {
    const card = res.getCardById('harvest-house-b071')
    expect(card.vps).toBe(2)
  })

  test('costs wood, clay, and reed', () => {
    const card = res.getCardById('harvest-house-b071')
    expect(card.cost).toEqual({ wood: 1, clay: 1, reed: 1 })
  })
})
