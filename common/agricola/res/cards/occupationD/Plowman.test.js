const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plowman (OccD 091)', () => {
  test('schedules fields for rounds current+4, +7, +10 when played in round 1', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 1
    game.state.scheduledPlowman = {}

    card.onPlay(game, dennis)

    expect(game.state.scheduledPlowman.dennis).toContain(5)  // 1 + 4
    expect(game.state.scheduledPlowman.dennis).toContain(8)  // 1 + 7
    expect(game.state.scheduledPlowman.dennis).toContain(11) // 1 + 10
  })

  test('only schedules rounds up to 14', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 8
    game.state.scheduledPlowman = {}

    card.onPlay(game, dennis)

    expect(game.state.scheduledPlowman.dennis).toContain(12) // 8 + 4
    expect(game.state.scheduledPlowman.dennis.length).toBe(1) // Only round 12
  })

  test('offers plow for food on scheduled round start with food', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.state.round = 5
    game.state.scheduledPlowman = { dennis: [5, 8, 11] }
    game.actions = { offerPlowForFood: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer plow on non-scheduled round', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.state.round = 6
    game.state.scheduledPlowman = { dennis: [5, 8, 11] }
    game.actions = { offerPlowForFood: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not offer plow when no food', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.round = 5
    game.state.scheduledPlowman = { dennis: [5, 8, 11] }
    game.actions = { offerPlowForFood: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('handles undefined scheduledPlowman', () => {
    const card = res.getCardById('plowman-d091')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.state.round = 5
    game.state.scheduledPlowman = undefined
    game.actions = { offerPlowForFood: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerPlowForFood).not.toHaveBeenCalled()
  })
})
