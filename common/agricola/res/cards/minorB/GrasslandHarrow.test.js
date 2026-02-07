const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Grassland Harrow (B018)', () => {
  test('schedules plow for future round based on building resources', () => {
    const card = res.getCardById('grassland-harrow-b018')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2
    dennis.clay = 1
    dennis.reed = 1
    dennis.stone = 0
    game.state.round = 3

    card.onPlay(game, dennis)

    // 2 + 1 + 1 + 0 = 4, so target round is 3 + 4 = 7
    expect(game.state.scheduledPlows[dennis.name]).toContain(7)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('grassland-harrow-b018')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 10
    dennis.clay = 10
    dennis.reed = 10
    dennis.stone = 10
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledPlows).toBeUndefined()
  })

  test('requires 2 occupations and building resources', () => {
    const card = res.getCardById('grassland-harrow-b018')
    expect(card.prereqs.occupations).toBe(2)
    expect(card.prereqs.buildingResourcesInSupply).toBe(1)
  })

  test('costs 2 wood', () => {
    const card = res.getCardById('grassland-harrow-b018')
    expect(card.cost).toEqual({ wood: 2 })
  })
})
