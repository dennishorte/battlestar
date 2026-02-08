const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Scythe Worker (OccA 112)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('scythe-worker-a112')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('gives additional grain during harvest for each grain field', () => {
    const card = res.getCardById('scythe-worker-a112')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getGrainFieldCount = () => 3

    card.onHarvest(game, dennis)

    expect(dennis.grain).toBe(3)
  })

  test('gives no additional grain when no grain fields', () => {
    const card = res.getCardById('scythe-worker-a112')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 5
    dennis.getGrainFieldCount = () => 0

    card.onHarvest(game, dennis)

    expect(dennis.grain).toBe(5)
  })
})
