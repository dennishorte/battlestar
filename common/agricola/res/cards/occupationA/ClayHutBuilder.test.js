const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Hut Builder (OccA 120)', () => {
  test('schedules clay on next 5 rounds when room type is not wood', () => {
    const card = res.getCardById('clay-hut-builder-a120')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    game.state.round = 3

    card.checkTrigger(game, dennis)

    expect(dennis.clayHutBuilderTriggered).toBe(true)
    expect(game.state.scheduledClay.dennis[4]).toBe(2)
    expect(game.state.scheduledClay.dennis[5]).toBe(2)
    expect(game.state.scheduledClay.dennis[6]).toBe(2)
    expect(game.state.scheduledClay.dennis[7]).toBe(2)
    expect(game.state.scheduledClay.dennis[8]).toBe(2)
  })

  test('does not trigger when still in wooden house', () => {
    const card = res.getCardById('clay-hut-builder-a120')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    game.state.round = 3

    card.checkTrigger(game, dennis)

    expect(dennis.clayHutBuilderTriggered).toBeUndefined()
  })

  test('does not trigger twice', () => {
    const card = res.getCardById('clay-hut-builder-a120')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.clayHutBuilderTriggered = true
    game.state.round = 5
    game.state.scheduledClay = {}

    card.checkTrigger(game, dennis)

    expect(game.state.scheduledClay.dennis).toBeUndefined()
  })

  test('does not schedule clay beyond round 14', () => {
    const card = res.getCardById('clay-hut-builder-a120')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    game.state.round = 12

    card.checkTrigger(game, dennis)

    expect(game.state.scheduledClay.dennis[13]).toBe(2)
    expect(game.state.scheduledClay.dennis[14]).toBe(2)
    expect(game.state.scheduledClay.dennis[15]).toBeUndefined()
    expect(game.state.scheduledClay.dennis[16]).toBeUndefined()
    expect(game.state.scheduledClay.dennis[17]).toBeUndefined()
  })
})
