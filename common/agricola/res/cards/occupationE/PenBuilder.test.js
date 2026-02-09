const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pen Builder (E086)', () => {
  test('initializes wood to 0 on play', () => {
    const card = res.getCardById('pen-builder-e086')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.wood).toBe(0)
  })

  test('allows placing wood when player has wood', () => {
    const card = res.getCardById('pen-builder-e086')

    const mockPlayer = {
      wood: 3,
    }

    expect(card.canPlaceWood(mockPlayer)).toBe(true)
  })

  test('does not allow placing wood when player has no wood', () => {
    const card = res.getCardById('pen-builder-e086')

    const mockPlayer = {
      wood: 0,
    }

    expect(card.canPlaceWood(mockPlayer)).toBe(false)
  })

  test('places wood on card and removes from player', () => {
    const card = res.getCardById('pen-builder-e086')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.wood = 2

    const dennis = t.player(game)
    dennis.wood = 5
    dennis.payCost = jest.fn((cost) => {
      if (cost.wood) {
        dennis.wood -= cost.wood
      }
    })

    card.placeWood(game, dennis, 3)

    expect(card.wood).toBe(5)
    expect(dennis.payCost).toHaveBeenCalledWith({ wood: 3 })
  })

  test('has correct card properties for animal storage', () => {
    const card = res.getCardById('pen-builder-e086')

    expect(card.allowsAnytimeAction).toBe(true)
    expect(card.mixedAnimals).toBe(true)
    expect(card.holdsAnimals).toEqual({ any: true })
  })

  test('returns correct animal capacity based on wood', () => {
    const card = res.getCardById('pen-builder-e086')

    card.wood = 3

    expect(card.getAnimalCapacity()).toBe(6)
  })

  test('returns 0 animal capacity when no wood', () => {
    const card = res.getCardById('pen-builder-e086')

    card.wood = 0

    expect(card.getAnimalCapacity()).toBe(0)
  })
})
