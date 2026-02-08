const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Renovation Materials (E002)', () => {
  test('calls freeRenovation action on play', () => {
    const card = res.getCardById('renovation-materials-e002')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.freeRenovation = (player, sourceCard, houseType) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(houseType).toBe('clay')
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('requires wood house as prereq', () => {
    const card = res.getCardById('renovation-materials-e002')
    expect(card.prereqs.houseType).toBe('wood')
  })

  test('costs clay and reed', () => {
    const card = res.getCardById('renovation-materials-e002')
    expect(card.cost.clay).toBe(3)
    expect(card.cost.reed).toBe(1)
  })
})
