const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Heresy Teacher (OccA 113)', () => {
  test('adds vegetables to eligible grain fields on lessons-1', () => {
    const card = res.getCardById('heresy-teacher-a113')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const eligibleFields = [{ row: 0, col: 0 }, { row: 1, col: 0 }]
    dennis.getFieldsWithGrainNoVegetable = () => eligibleFields
    dennis.addVegetableToField = jest.fn()

    card.onAction(game, dennis, 'lessons-1')

    expect(dennis.addVegetableToField).toHaveBeenCalledTimes(2)
    expect(dennis.addVegetableToField).toHaveBeenCalledWith(eligibleFields[0])
    expect(dennis.addVegetableToField).toHaveBeenCalledWith(eligibleFields[1])
  })

  test('adds vegetables to eligible grain fields on lessons-2', () => {
    const card = res.getCardById('heresy-teacher-a113')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const eligibleFields = [{ row: 0, col: 1 }]
    dennis.getFieldsWithGrainNoVegetable = () => eligibleFields
    dennis.addVegetableToField = jest.fn()

    card.onAction(game, dennis, 'lessons-2')

    expect(dennis.addVegetableToField).toHaveBeenCalledTimes(1)
    expect(dennis.addVegetableToField).toHaveBeenCalledWith(eligibleFields[0])
  })

  test('does nothing when no eligible fields', () => {
    const card = res.getCardById('heresy-teacher-a113')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFieldsWithGrainNoVegetable = () => []
    dennis.addVegetableToField = jest.fn()

    card.onAction(game, dennis, 'lessons-1')

    expect(dennis.addVegetableToField).not.toHaveBeenCalled()
  })

  test('does not trigger for non-lessons actions', () => {
    const card = res.getCardById('heresy-teacher-a113')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFieldsWithGrainNoVegetable = jest.fn().mockReturnValue([{ row: 0, col: 0 }])
    dennis.addVegetableToField = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.getFieldsWithGrainNoVegetable).not.toHaveBeenCalled()
    expect(dennis.addVegetableToField).not.toHaveBeenCalled()
  })
})
