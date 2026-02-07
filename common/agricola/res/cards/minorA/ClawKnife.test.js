const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Claw Knife (A046)', () => {
  test('schedules food on next 2 round spaces on sheep action', () => {
    const card = res.getCardById('claw-knife-a046')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'take-sheep')

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
  })

  test('does not schedule food past round 14', () => {
    const card = res.getCardById('claw-knife-a046')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onAction(game, dennis, 'take-sheep')

    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
  })

  test('does not trigger on non-sheep actions', () => {
    const card = res.getCardById('claw-knife-a046')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'take-wood')

    expect(game.state.scheduledFood).toBeUndefined()
  })
})
