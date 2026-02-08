const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Spice Trader (E104)', () => {
  test('schedules 3 vegetables for round 11 when played in round 4 or before', () => {
    const card = res.getCardById('spice-trader-e104')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledVegetables.dennis[11]).toBe(3)
  })

  test('does not schedule vegetables when played after round 4', () => {
    const card = res.getCardById('spice-trader-e104')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledVegetables).toBeUndefined()
  })

  test('adds to existing scheduled vegetables', () => {
    const card = res.getCardById('spice-trader-e104')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 2

    game.state.scheduledVegetables = { dennis: { 11: 2 } }

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(game.state.scheduledVegetables.dennis[11]).toBe(5)
  })
})
