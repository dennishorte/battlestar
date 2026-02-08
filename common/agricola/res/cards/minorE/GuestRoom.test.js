const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Guest Room (E022)', () => {
  test('enables guest worker', () => {
    const card = res.getCardById('guest-room-e022')
    expect(card.enablesGuestWorker).toBe(true)
  })

  test('stores food resource', () => {
    const card = res.getCardById('guest-room-e022')
    expect(card.storedResource).toBe('food')
  })

  test('calls placeResourcesOnCard action on play', () => {
    const card = res.getCardById('guest-room-e022')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.placeResourcesOnCard = (player, sourceCard, resourceType) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(resourceType).toBe('food')
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
