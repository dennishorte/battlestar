const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Fire Protection Pond (A045)', () => {
  test('schedules food when player no longer has wood house', () => {
    const card = res.getCardById('fire-protection-pond-a045')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    game.state.round = 4

    card.checkTrigger(game, dennis)

    expect(dennis.fireProtectionPondTriggered).toBe(true)
    expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][10]).toBe(1)
  })

  test('does not trigger if still in wood house', () => {
    const card = res.getCardById('fire-protection-pond-a045')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    game.state.round = 4

    card.checkTrigger(game, dennis)

    expect(dennis.fireProtectionPondTriggered).toBeUndefined()
    expect(game.state.scheduledFood).toBeUndefined()
  })

  test('only triggers once', () => {
    const card = res.getCardById('fire-protection-pond-a045')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.fireProtectionPondTriggered = true
    game.state.round = 4

    card.checkTrigger(game, dennis)

    expect(game.state.scheduledFood).toBeUndefined()
  })
})
