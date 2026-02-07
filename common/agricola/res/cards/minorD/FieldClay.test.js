const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Clay (D005)', () => {
  test('gives clay for each planted field', () => {
    const card = res.getCardById('field-clay-d005')
    const game = t.fixture({ cardSets: ['minorD'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.getPlantedFields = () => [{ grain: 2 }, { vegetables: 1 }, { grain: 1 }]

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(3)
  })
})
