const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Archway (D051)', () => {
  test('provides action space and gives 1 food when used', () => {
    const card = res.getCardById('archway-d051')
    const game = t.fixture({ cardSets: ['minorD'] })
    game.run()
    game.log = { add: jest.fn() }

    const dennis = t.player(game)
    dennis.food = 0
    dennis.addResource = (type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    }

    card.onActionSpaceUsed(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.archwayExtraAction).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('archway-d051')
    expect(card.providesActionSpace).toBe(true)
    expect(card.actionSpaceId).toBe('archway')
    expect(card.cost).toEqual({ clay: 2 })
    expect(card.vps).toBe(4)
    expect(card.prereqs).toEqual({ noOccupations: true })
  })
})
