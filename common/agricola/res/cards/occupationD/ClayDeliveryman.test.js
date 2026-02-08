const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Deliveryman (OccD 120)', () => {
  test('schedules clay for rounds 6-14 when played in round 1', () => {
    const card = res.getCardById('clay-deliveryman-d120')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 1
    game.state.scheduledClay = {}

    card.onPlay(game, dennis)

    expect(game.state.scheduledClay.dennis[6]).toBe(1)
    expect(game.state.scheduledClay.dennis[7]).toBe(1)
    expect(game.state.scheduledClay.dennis[14]).toBe(1)
  })

  test('schedules clay only for remaining rounds when played in round 7', () => {
    const card = res.getCardById('clay-deliveryman-d120')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 7
    game.state.scheduledClay = {}

    card.onPlay(game, dennis)

    expect(game.state.scheduledClay.dennis[6]).toBeUndefined()
    expect(game.state.scheduledClay.dennis[7]).toBeUndefined()
    expect(game.state.scheduledClay.dennis[8]).toBe(1)
    expect(game.state.scheduledClay.dennis[14]).toBe(1)
  })

  test('schedules no clay when played in round 14', () => {
    const card = res.getCardById('clay-deliveryman-d120')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 14
    game.state.scheduledClay = {}

    card.onPlay(game, dennis)

    // No rounds left, so scheduledClay.dennis may not be initialized at all
    expect(game.state.scheduledClay.dennis).toBeUndefined()
  })

  test('adds to existing scheduled clay', () => {
    const card = res.getCardById('clay-deliveryman-d120')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    game.state.scheduledClay = { dennis: { 6: 2 } }

    card.onPlay(game, dennis)

    expect(game.state.scheduledClay.dennis[6]).toBe(3)
  })
})
