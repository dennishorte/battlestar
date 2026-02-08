const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Night Loot (E005)', () => {
  test('calls nightLoot action on play', () => {
    const card = res.getCardById('night-loot-e005')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.nightLoot = (player, sourceCard) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('costs 2 food', () => {
    const card = res.getCardById('night-loot-e005')
    expect(card.cost.food).toBe(2)
  })
})
