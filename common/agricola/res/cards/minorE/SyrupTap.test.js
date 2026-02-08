const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Syrup Tap (E047)', () => {
  test('schedules food for next round when getting wood', () => {
    const card = res.getCardById('syrup-tap-e047')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    card.onAction(game, dennis, 'forest', { wood: 3 })

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
  })

  test('does not schedule food when getting 0 wood', () => {
    const card = res.getCardById('syrup-tap-e047')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    game.state.scheduledFood = {}

    card.onAction(game, dennis, 'clay-pit', { wood: 0, clay: 3 })

    expect(game.state.scheduledFood[dennis.name]).toBeUndefined()
  })

  test('does not schedule food beyond round 14', () => {
    const card = res.getCardById('syrup-tap-e047')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 14

    const dennis = t.player(game)
    game.state.scheduledFood = {}

    card.onAction(game, dennis, 'forest', { wood: 2 })

    expect(game.state.scheduledFood[dennis.name]).toBeUndefined()
  })

  test('does not schedule when resources is null', () => {
    const card = res.getCardById('syrup-tap-e047')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    game.state.scheduledFood = {}

    card.onAction(game, dennis, 'day-laborer', null)

    expect(game.state.scheduledFood[dennis.name]).toBeUndefined()
  })
})
