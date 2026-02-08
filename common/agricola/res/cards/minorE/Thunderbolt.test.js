const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Thunderbolt (E004)', () => {
  test('calls thunderboltExchange action on play', () => {
    const card = res.getCardById('thunderbolt-e004')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.thunderboltExchange = (player, sourceCard) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('requires 1 grain field as prereq', () => {
    const card = res.getCardById('thunderbolt-e004')
    expect(card.prereqs.grainFields).toBe(1)
  })
})
