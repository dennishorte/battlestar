const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Raised Bed (E061)', () => {
  test('gives 4 food at harvest start', () => {
    const card = res.getCardById('raised-bed-e061')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onHarvestStart(game, dennis)

    expect(dennis.food).toBe(4)
  })

  test('has 1 vps', () => {
    const card = res.getCardById('raised-bed-e061')
    expect(card.vps).toBe(1)
  })

  test('requires 2 grain fields as prereq', () => {
    const card = res.getCardById('raised-bed-e061')
    expect(card.prereqs.grainFields).toBe(2)
  })
})
