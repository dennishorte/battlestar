const res = require('../../index.js')

describe('Breed Registry (D036)', () => {
  test('initializes tracking on play', () => {
    const card = res.getCardById('breed-registry-d036')
    const player = {}
    const game = {}

    card.onPlay(game, player)

    expect(player.breedRegistryActive).toBe(true)
    expect(player.sheepGainedNonBreeding).toBe(0)
    expect(player.sheepTurnedToFood).toBe(0)
  })

  test('gives 3 bonus points when conditions are met', () => {
    const card = res.getCardById('breed-registry-d036')
    const player = {
      breedRegistryActive: true,
      sheepGainedNonBreeding: 2,
      sheepTurnedToFood: 0,
    }

    expect(card.getEndGamePoints(player)).toBe(3)
  })

  test('gives 0 points when too many sheep gained non-breeding', () => {
    const card = res.getCardById('breed-registry-d036')
    const player = {
      breedRegistryActive: true,
      sheepGainedNonBreeding: 3,
      sheepTurnedToFood: 0,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points when sheep turned to food', () => {
    const card = res.getCardById('breed-registry-d036')
    const player = {
      breedRegistryActive: true,
      sheepGainedNonBreeding: 1,
      sheepTurnedToFood: 1,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points when not active', () => {
    const card = res.getCardById('breed-registry-d036')
    const player = {
      breedRegistryActive: false,
      sheepGainedNonBreeding: 0,
      sheepTurnedToFood: 0,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('breed-registry-d036')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ noSheep: true })
  })
})
