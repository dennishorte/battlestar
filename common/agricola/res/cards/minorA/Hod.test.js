const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hod (A077)', () => {
  test('gives 1 clay on play', () => {
    const card = res.getCardById('hod-a077')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(1)
  })

  test('gives 2 clay when any player uses pig market', () => {
    const card = res.getCardById('hod-a077')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.clay = 0

    card.onAnyAction(game, micah, 'take-boar', dennis)

    expect(dennis.clay).toBe(2)
  })

  test('gives 2 clay when owner uses pig market', () => {
    const card = res.getCardById('hod-a077')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAnyAction(game, dennis, 'take-boar', dennis)

    expect(dennis.clay).toBe(2)
  })

  test('does not give clay for non-pig actions', () => {
    const card = res.getCardById('hod-a077')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAnyAction(game, dennis, 'take-sheep', dennis)

    expect(dennis.clay).toBe(0)
  })
})
