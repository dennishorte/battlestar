const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Work Certificate (A082)', () => {
  test('offers work certificate on any action', () => {
    const card = res.getCardById('work-certificate-a082')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let offerCalled = false
    game.actions.offerWorkCertificate = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onAction(game, dennis, 'take-wood')

    expect(offerCalled).toBe(true)
  })

  test('triggers on any action type', () => {
    const card = res.getCardById('work-certificate-a082')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let callCount = 0
    game.actions.offerWorkCertificate = () => {
      callCount++
    }

    card.onAction(game, dennis, 'take-clay')
    card.onAction(game, dennis, 'plow-field')
    card.onAction(game, dennis, 'day-laborer')

    expect(callCount).toBe(3)
  })
})
