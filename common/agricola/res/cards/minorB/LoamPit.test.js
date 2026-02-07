const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Loam Pit (B077)', () => {
  test('gives 3 clay on Day Laborer action', () => {
    const card = res.getCardById('loam-pit-b077')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.clay).toBe(3)
  })
})
