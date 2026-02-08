const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Land Heir (E119)', () => {
  test('schedules 4 wood and 4 clay for round 9 when played in round 4 or before', () => {
    const card = res.getCardById('land-heir-e119')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[9]).toBe(4)
    expect(game.state.scheduledClay.dennis[9]).toBe(4)
  })

  test('does not schedule resources when played after round 4', () => {
    const card = res.getCardById('land-heir-e119')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood).toBeUndefined()
    expect(game.state.scheduledClay).toBeUndefined()
  })

  test('adds to existing scheduled resources', () => {
    const card = res.getCardById('land-heir-e119')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 2

    game.state.scheduledWood = { dennis: { 9: 2 } }
    game.state.scheduledClay = { dennis: { 9: 1 } }

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood.dennis[9]).toBe(6)
    expect(game.state.scheduledClay.dennis[9]).toBe(5)
  })
})
