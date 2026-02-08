const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Water Gully (E042)', () => {
  test('schedules cattle, grain, cattle for next 3 rounds', () => {
    const card = res.getCardById('water-gully-e042')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(game.state.scheduledCattle[dennis.name][6]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][7]).toBe(1)
    expect(game.state.scheduledCattle[dennis.name][8]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('water-gully-e042')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 13

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    // Round 14 cattle is scheduled, but round 15+ are beyond game end
    expect(game.state.scheduledCattle[dennis.name][14]).toBe(1)
    // scheduledGrain for round 15 would be under dennis.name but the round key wouldn't exist
    // Need to check if scheduledGrain even has the player's entry at all
    expect(game.state.scheduledGrain?.[dennis.name]?.[15]).toBeUndefined()
    expect(game.state.scheduledCattle?.[dennis.name]?.[16]).toBeUndefined()
  })

  test('requires well major improvement as prereq', () => {
    const card = res.getCardById('water-gully-e042')
    expect(card.prereqs.majorImprovement).toBe('well')
  })

  test('costs 1 stone', () => {
    const card = res.getCardById('water-gully-e042')
    expect(card.cost.stone).toBe(1)
  })
})
