const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ropemaker (OccA 145)', () => {
  test('gives 1 reed at end of harvest', () => {
    const card = res.getCardById('ropemaker-a145')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    card.onHarvestEnd(game, dennis)

    expect(dennis.reed).toBe(1)
  })

  test('accumulates reed over multiple harvests', () => {
    const card = res.getCardById('ropemaker-a145')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 2

    card.onHarvestEnd(game, dennis)

    expect(dennis.reed).toBe(3)
  })
})
