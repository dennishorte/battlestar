const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mud Wallower (C148)', () => {
  test('holds boar animals', () => {
    const card = res.getCardById('mud-wallower-c148')

    expect(card.holdsAnimals).toEqual({ boar: true })
  })

  test('initializes clay and boar count on play', () => {
    const card = res.getCardById('mud-wallower-c148')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.clay).toBe(0)
    expect(card.boar).toBe(0)
  })

  test('accumulates clay when using accumulation space', () => {
    const card = res.getCardById('mud-wallower-c148')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 0
    card.boar = 0
    game.isAccumulationSpace = () => true

    card.onAction(game, dennis, 'take-wood')

    expect(card.clay).toBe(1)
  })

  test('converts 4 clay to 1 boar', () => {
    const card = res.getCardById('mud-wallower-c148')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 3
    card.boar = 0
    game.isAccumulationSpace = () => true
    game.log = { add: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(card.clay).toBe(0)
    expect(card.boar).toBe(1)
  })

  test('does not accumulate clay for non-accumulation spaces', () => {
    const card = res.getCardById('mud-wallower-c148')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.clay = 0
    game.isAccumulationSpace = () => false

    card.onAction(game, dennis, 'day-laborer')

    expect(card.clay).toBe(0)
  })

  test('animal capacity equals boar count', () => {
    const card = res.getCardById('mud-wallower-c148')
    card.boar = 3

    expect(card.getAnimalCapacity()).toBe(3)
  })

  test('animal capacity is 0 when no boar', () => {
    const card = res.getCardById('mud-wallower-c148')
    card.boar = 0

    expect(card.getAnimalCapacity()).toBe(0)
  })
})
