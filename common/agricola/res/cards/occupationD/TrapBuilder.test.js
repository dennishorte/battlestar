const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Trap Builder (OccD 147)', () => {
  test('schedules 2 food and 1 boar for next 3 rounds when using day-laborer', () => {
    const card = res.getCardById('trap-builder-d147')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    game.state.scheduledFood = {}
    game.state.scheduledBoar = {}

    card.onAction(game, dennis, 'day-laborer')

    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
    expect(game.state.scheduledBoar.dennis[8]).toBe(1)
  })

  test('only schedules for rounds up to 14', () => {
    const card = res.getCardById('trap-builder-d147')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13
    game.state.scheduledFood = {}
    game.state.scheduledBoar = {}

    card.onAction(game, dennis, 'day-laborer')

    expect(game.state.scheduledFood.dennis[14]).toBe(1)
    expect(game.state.scheduledFood.dennis[15]).toBeUndefined()
    // Round 16 (13+3) for boar is out of bounds, so scheduledBoar.dennis may not be initialized
    expect(game.state.scheduledBoar.dennis?.[15]).toBeUndefined()
  })

  test('adds to existing scheduled resources', () => {
    const card = res.getCardById('trap-builder-d147')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    game.state.scheduledFood = { dennis: { 6: 2 } }
    game.state.scheduledBoar = {}

    card.onAction(game, dennis, 'day-laborer')

    expect(game.state.scheduledFood.dennis[6]).toBe(3)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('trap-builder-d147')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    game.state.scheduledFood = {}
    game.state.scheduledBoar = {}

    card.onAction(game, dennis, 'take-wood')

    expect(game.state.scheduledFood.dennis).toBeUndefined()
    expect(game.state.scheduledBoar.dennis).toBeUndefined()
  })
})
