const t = require('../../../testutil_v2.js')

describe('Pet Broker', () => {
  // Card text: "When you play this card, you immediately get 1 sheep.
  // You can keep 1 sheep on each occupation in front of you."
  // Card is 3+ players.

  test('onPlay gives 1 sheep as house pet', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pet-broker-b148'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Pet Broker')

    t.testBoard(game, {
      dennis: {
        occupations: ['pet-broker-b148'],
        animals: { sheep: 1 },
        pet: 'sheep',
      },
    })
  })

  test('animal capacity on card equals number of played occupations', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['pet-broker-b148', 'test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // 3 occupations → capacity 3
    const dennis = game.players.byName('dennis')
    const holdings = dennis.getAnimalHoldingCards()
    const petBroker = holdings.find(h => h.cardId === 'pet-broker-b148')
    expect(petBroker).toBeDefined()
    expect(petBroker.capacity).toBe(3)
    expect(petBroker.allowedTypes).toEqual(['sheep'])
  })

  test('can hold sheep on card up to occupation count', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
      dennis: {
        occupations: ['pet-broker-b148', 'test-occupation-1'],
      },
    })
    game.run()

    // Take 2 sheep from Sheep Market; Pet Broker can hold 2 (2 occupations)
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['pet-broker-b148', 'test-occupation-1'],
        animals: { sheep: 3 },
        pet: 'sheep',
      },
    })
  })
})
