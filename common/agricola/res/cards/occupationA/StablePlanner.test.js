const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stable Planner (OccA 089)', () => {
  test('schedules free stables on rounds +3, +6, +9', () => {
    const card = res.getCardById('stable-planner-a089')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 2

    card.onPlay(game, dennis)

    expect(game.state.scheduledFreeStables.dennis).toContain(5)
    expect(game.state.scheduledFreeStables.dennis).toContain(8)
    expect(game.state.scheduledFreeStables.dennis).toContain(11)
  })

  test('does not schedule stables beyond round 14', () => {
    const card = res.getCardById('stable-planner-a089')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 10

    card.onPlay(game, dennis)

    expect(game.state.scheduledFreeStables.dennis).toContain(13)
    expect(game.state.scheduledFreeStables.dennis).not.toContain(16)
    expect(game.state.scheduledFreeStables.dennis).not.toContain(19)
  })

  test('schedules only valid rounds when played late', () => {
    const card = res.getCardById('stable-planner-a089')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 12

    card.onPlay(game, dennis)

    // Only round 15 would be +3, but that's > 14
    // When no rounds are scheduled, the player key may not exist
    const scheduled = game.state.scheduledFreeStables?.dennis || []
    expect(scheduled.length).toBe(0)
  })
})
