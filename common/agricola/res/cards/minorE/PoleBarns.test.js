const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pole Barns (E001)', () => {
  test('calls buildFreeStables action on play', () => {
    const card = res.getCardById('pole-barns-e001')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.buildFreeStables = (player, sourceCard, maxStables) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(maxStables).toBe(3)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('requires 15 fences as prereq', () => {
    const card = res.getCardById('pole-barns-e001')
    expect(card.prereqs.fences).toBe(15)
  })

  test('costs 2 wood', () => {
    const card = res.getCardById('pole-barns-e001')
    expect(card.cost.wood).toBe(2)
  })
})
