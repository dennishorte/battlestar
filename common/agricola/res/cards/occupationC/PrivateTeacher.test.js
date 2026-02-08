const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Private Teacher (C131)', () => {
  test('offers occupation when using take-grain and lessons-1 is occupied', () => {
    const card = res.getCardById('private-teacher-c131')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = (actionId) => actionId === 'lessons-1'
    game.actions = { offerPlayOccupation: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerPlayOccupation).toHaveBeenCalledWith(
      dennis,
      card,
      { cost: { food: 1 } }
    )
  })

  test('offers occupation when using take-grain and lessons-2 is occupied', () => {
    const card = res.getCardById('private-teacher-c131')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = (actionId) => actionId === 'lessons-2'
    game.actions = { offerPlayOccupation: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerPlayOccupation).toHaveBeenCalledWith(
      dennis,
      card,
      { cost: { food: 1 } }
    )
  })

  test('does not offer occupation when no lessons action is occupied', () => {
    const card = res.getCardById('private-teacher-c131')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = () => false
    game.actions = { offerPlayOccupation: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerPlayOccupation).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('private-teacher-c131')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = () => true
    game.actions = { offerPlayOccupation: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerPlayOccupation).not.toHaveBeenCalled()
  })
})
