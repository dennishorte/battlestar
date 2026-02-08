const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Workshop Assistant (C146)', () => {
  test('initializes resource pairs on play', () => {
    const card = res.getCardById('workshop-assistant-c146')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAllImprovements = () => [
      { id: 'fireplace-2' },
      { id: 'pottery' },
    ]
    game.actions = {
      chooseBuildingResourcePair: jest.fn().mockReturnValue({ wood: 1, clay: 1 }),
    }

    card.onPlay(game, dennis)

    expect(card.resourcePairs).toBeDefined()
    expect(card.resourcePairs.length).toBe(2)
    expect(game.actions.chooseBuildingResourcePair).toHaveBeenCalledTimes(2)
  })

  test('offers claim when another player renovates and pairs exist', () => {
    const card = res.getCardById('workshop-assistant-c146')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    card.resourcePairs = [{ improvement: 'fireplace-2', resources: { wood: 1, clay: 1 } }]
    game.actions = { offerWorkshopAssistantClaim: jest.fn() }

    card.onAnyRenovate(game, micah, dennis)

    expect(game.actions.offerWorkshopAssistantClaim).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer claim when card owner renovates', () => {
    const card = res.getCardById('workshop-assistant-c146')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.resourcePairs = [{ improvement: 'fireplace-2', resources: { wood: 1, clay: 1 } }]
    game.actions = { offerWorkshopAssistantClaim: jest.fn() }

    card.onAnyRenovate(game, dennis, dennis)

    expect(game.actions.offerWorkshopAssistantClaim).not.toHaveBeenCalled()
  })

  test('does not offer claim when no resource pairs left', () => {
    const card = res.getCardById('workshop-assistant-c146')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    card.resourcePairs = []
    game.actions = { offerWorkshopAssistantClaim: jest.fn() }

    card.onAnyRenovate(game, micah, dennis)

    expect(game.actions.offerWorkshopAssistantClaim).not.toHaveBeenCalled()
  })

  test('does not offer claim when resourcePairs is undefined', () => {
    const card = res.getCardById('workshop-assistant-c146')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    card.resourcePairs = undefined
    game.actions = { offerWorkshopAssistantClaim: jest.fn() }

    card.onAnyRenovate(game, micah, dennis)

    expect(game.actions.offerWorkshopAssistantClaim).not.toHaveBeenCalled()
  })
})
