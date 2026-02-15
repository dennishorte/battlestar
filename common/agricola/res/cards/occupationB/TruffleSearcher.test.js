const t = require('../../../testutil_v2.js')

describe('Truffle Searcher', () => {
  // Card text: "This card can hold a number of wild boar equal to the number
  // of completed feeding phases."
  // Uses holdsAnimals: { boar: true } + getAnimalCapacity.

  test('holds boar after completed feeding phases', () => {
    // After round 4 harvest (1 feeding phase), capacity = 1.
    // Use round 5 so getCompletedFeedingPhases() = 1 (round 4 harvest done).
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 5,
      dennis: {
        occupations: ['truffle-searcher-b086'],
      },
    })
    game.run()

    // Verify capacity = 1 (1 feeding phase at round 4 < round 5)
    const cardDef = game.cards.byId('truffle-searcher-b086').definition
    expect(cardDef.getAnimalCapacity(game)).toBe(1)
  })

  test('holds 0 boar before any feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['truffle-searcher-b086'],
      },
    })
    game.run()

    // Round 1: no feeding phases completed → capacity = 0
    const cardDef = game.cards.byId('truffle-searcher-b086').definition
    expect(cardDef.getAnimalCapacity(game)).toBe(0)
  })
})
