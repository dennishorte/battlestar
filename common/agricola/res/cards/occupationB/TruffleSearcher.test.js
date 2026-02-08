const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Truffle Searcher (B086)', () => {
  test('has holdsAnimals flag for boar', () => {
    const card = res.getCardById('truffle-searcher-b086')
    expect(card.holdsAnimals.boar).toBe(true)
  })

  test('provides animal capacity based on completed feeding phases', () => {
    const card = res.getCardById('truffle-searcher-b086')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.getCompletedFeedingPhases = jest.fn().mockReturnValue(3)

    const capacity = card.getAnimalCapacity(game)

    expect(capacity).toBe(3)
  })

  test('provides 0 capacity when no feeding phases completed', () => {
    const card = res.getCardById('truffle-searcher-b086')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.getCompletedFeedingPhases = jest.fn().mockReturnValue(0)

    const capacity = card.getAnimalCapacity(game)

    expect(capacity).toBe(0)
  })
})
