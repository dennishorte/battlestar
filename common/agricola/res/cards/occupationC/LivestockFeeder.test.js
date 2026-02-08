const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Livestock Feeder (C086)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('livestock-feeder-c086')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('has mixed animals property set', () => {
    const card = res.getCardById('livestock-feeder-c086')

    expect(card.mixedAnimals).toBe(true)
    expect(card.holdsAnimals).toEqual({ any: true })
  })

  test('provides animal capacity equal to grain count', () => {
    const card = res.getCardById('livestock-feeder-c086')

    const mockPlayer = {
      grain: 5,
    }

    expect(card.getAnimalCapacity(mockPlayer)).toBe(5)
  })

  test('provides 0 capacity when no grain', () => {
    const card = res.getCardById('livestock-feeder-c086')

    const mockPlayer = {
      grain: 0,
    }

    expect(card.getAnimalCapacity(mockPlayer)).toBe(0)
  })
})
