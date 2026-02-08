const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mason (C087)', () => {
  test('places room on card when played', () => {
    const card = res.getCardById('mason-c087')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.hasRoom).toBe(true)
  })

  test('can add free room when in stone house with 4+ rooms', () => {
    const card = res.getCardById('mason-c087')
    card.hasRoom = true

    const mockPlayer = {
      roomType: 'stone',
      getRoomCount: () => 4,
    }

    expect(card.canAddFreeRoom(mockPlayer)).toBe(true)
  })

  test('cannot add free room when not in stone house', () => {
    const card = res.getCardById('mason-c087')
    card.hasRoom = true

    const mockPlayer = {
      roomType: 'clay',
      getRoomCount: () => 5,
    }

    expect(card.canAddFreeRoom(mockPlayer)).toBe(false)
  })

  test('cannot add free room when less than 4 rooms', () => {
    const card = res.getCardById('mason-c087')
    card.hasRoom = true

    const mockPlayer = {
      roomType: 'stone',
      getRoomCount: () => 3,
    }

    expect(card.canAddFreeRoom(mockPlayer)).toBe(false)
  })

  test('cannot add free room when no room on card', () => {
    const card = res.getCardById('mason-c087')
    card.hasRoom = false

    const mockPlayer = {
      roomType: 'stone',
      getRoomCount: () => 5,
    }

    expect(card.canAddFreeRoom(mockPlayer)).toBe(false)
  })

  test('removes room from card when adding free room', () => {
    const card = res.getCardById('mason-c087')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.hasRoom = true
    game.actions = { buildFreeRoom: jest.fn() }

    card.addFreeRoom(game, dennis)

    expect(card.hasRoom).toBe(false)
    expect(game.actions.buildFreeRoom).toHaveBeenCalledWith(dennis, card)
  })
})
