const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tea Time (E003)', () => {
  test('returns worker from grain-utilization on play', () => {
    const card = res.getCardById('tea-time-e003')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.returnWorkerFromAction = (player, actionId) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(actionId).toBe('grain-utilization')
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('costs 1 food', () => {
    const card = res.getCardById('tea-time-e003')
    expect(card.cost.food).toBe(1)
  })

  test('requires person on grain-utilization as prereq', () => {
    const card = res.getCardById('tea-time-e003')
    expect(card.prereqs.personOnAction).toBe('grain-utilization')
  })
})
