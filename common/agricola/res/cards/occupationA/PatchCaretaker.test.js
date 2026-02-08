const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Patch Caretaker (OccA 161)', () => {
  test('gives vegetable when using second accumulation space of same type', () => {
    const card = res.getCardById('patch-caretaker-a161')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.usedAccumulationSpaceTypes = ['wood']
    game.isAccumulationSpace = () => true
    game.getAccumulationSpaceGoodType = () => 'wood'

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.vegetables).toBe(1)
  })

  test('does not give vegetable on first use of accumulation type', () => {
    const card = res.getCardById('patch-caretaker-a161')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.usedAccumulationSpaceTypes = ['clay'] // Different type
    game.isAccumulationSpace = () => true
    game.getAccumulationSpaceGoodType = () => 'wood'

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.vegetables).toBe(0)
  })

  test('tracks used accumulation space types', () => {
    const card = res.getCardById('patch-caretaker-a161')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    game.isAccumulationSpace = () => true
    game.getAccumulationSpaceGoodType = () => 'wood'

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.usedAccumulationSpaceTypes).toContain('wood')
  })

  test('does not trigger for non-accumulation spaces', () => {
    const card = res.getCardById('patch-caretaker-a161')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    game.isAccumulationSpace = () => false

    card.onAction(game, dennis, 'plow-field')

    expect(dennis.vegetables).toBe(0)
    expect(dennis.usedAccumulationSpaceTypes).toBeUndefined()
  })
})
