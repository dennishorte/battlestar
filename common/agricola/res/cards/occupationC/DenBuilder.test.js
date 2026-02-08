const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Den Builder (C085)', () => {
  test('initially does not provide room', () => {
    const card = res.getCardById('den-builder-c085')

    expect(card.providesRoom).toBe(false)
  })

  test('can activate room when living in clay house with required resources', () => {
    const card = res.getCardById('den-builder-c085')

    const mockPlayer = {
      roomType: 'clay',
      grain: 2,
      food: 3,
    }

    expect(card.canActivateRoom(mockPlayer)).toBe(true)
  })

  test('can activate room when living in stone house with required resources', () => {
    const card = res.getCardById('den-builder-c085')

    const mockPlayer = {
      roomType: 'stone',
      grain: 1,
      food: 2,
    }

    expect(card.canActivateRoom(mockPlayer)).toBe(true)
  })

  test('cannot activate room when living in wood house', () => {
    const card = res.getCardById('den-builder-c085')

    const mockPlayer = {
      roomType: 'wood',
      grain: 5,
      food: 5,
    }

    expect(card.canActivateRoom(mockPlayer)).toBe(false)
  })

  test('cannot activate room without enough grain', () => {
    const card = res.getCardById('den-builder-c085')

    const mockPlayer = {
      roomType: 'clay',
      grain: 0,
      food: 5,
    }

    expect(card.canActivateRoom(mockPlayer)).toBe(false)
  })

  test('cannot activate room without enough food', () => {
    const card = res.getCardById('den-builder-c085')

    const mockPlayer = {
      roomType: 'stone',
      grain: 2,
      food: 1,
    }

    expect(card.canActivateRoom(mockPlayer)).toBe(false)
  })

  test('activating room removes resources and sets providesRoom', () => {
    const card = res.getCardById('den-builder-c085')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 3
    dennis.food = 5
    dennis.roomType = 'clay'
    dennis.removeResource = jest.fn()
    game.log = { add: jest.fn() }

    card.activateRoom(game, dennis)

    expect(dennis.removeResource).toHaveBeenCalledWith('grain', 1)
    expect(dennis.removeResource).toHaveBeenCalledWith('food', 2)
    expect(card.providesRoom).toBe(true)
  })
})
