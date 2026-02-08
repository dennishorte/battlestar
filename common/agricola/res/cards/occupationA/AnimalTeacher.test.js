const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Teacher (OccA 168)', () => {
  test('offers to buy animal after using lessons-1 action', () => {
    const card = res.getCardById('animal-teacher-a168')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuyAnimalTeacher: jest.fn() }

    card.onAction(game, dennis, 'lessons-1')

    expect(game.actions.offerBuyAnimalTeacher).toHaveBeenCalledWith(dennis, card)
  })

  test('offers to buy animal after using lessons-2 action', () => {
    const card = res.getCardById('animal-teacher-a168')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuyAnimalTeacher: jest.fn() }

    card.onAction(game, dennis, 'lessons-2')

    expect(game.actions.offerBuyAnimalTeacher).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for non-lessons actions', () => {
    const card = res.getCardById('animal-teacher-a168')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuyAnimalTeacher: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerBuyAnimalTeacher).not.toHaveBeenCalled()
  })
})
