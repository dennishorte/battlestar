const t = require('../../../testutil_v2.js')

describe('Woolgrower', () => {
  test('getAnimalCapacity equals completed feeding phases', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['woolgrower-a148'],
      },
    })
    game.run()
    const cardDef = game.cards.byId('woolgrower-a148').definition
    expect(game.getCompletedFeedingPhases()).toBe(0)
    expect(cardDef.getAnimalCapacity(game)).toBe(0)
  })

  test('after one harvest, capacity is 1', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 5, // after first harvest (round 4)
      dennis: {
        occupations: ['woolgrower-a148'],
      },
    })
    game.run()
    const cardDef = game.cards.byId('woolgrower-a148').definition
    expect(game.getCompletedFeedingPhases()).toBe(1)
    expect(cardDef.getAnimalCapacity(game)).toBe(1)
  })

  test('getAnimalHoldingCards includes Woolgrower with capacity equal to completed feeding phases', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      dennis: {
        occupations: ['woolgrower-a148'],
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    const holdings = dennis.getAnimalHoldingCards()
    const woolgrower = holdings.find(h => h.cardId === 'woolgrower-a148')
    expect(woolgrower).toBeDefined()
    expect(woolgrower.capacity).toBe(1)
    expect(woolgrower.allowedTypes).toEqual(['sheep'])
  })
})
