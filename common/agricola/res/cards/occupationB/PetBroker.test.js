const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pet Broker (B148)', () => {
  test('gives 1 sheep on play when can place animals', () => {
    const card = res.getCardById('pet-broker-b148')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
  })

  test('does not give sheep when cannot place animals', () => {
    const card = res.getCardById('pet-broker-b148')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(false)
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('provides animal capacity based on occupation count', () => {
    const card = res.getCardById('pet-broker-b148')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = jest.fn().mockReturnValue(4)

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(4)
  })

  test('has holdsAnimals flag for sheep', () => {
    const card = res.getCardById('pet-broker-b148')
    expect(card.holdsAnimals.sheep).toBe(true)
  })
})
