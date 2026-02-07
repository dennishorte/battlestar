const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lifting Machine (A070)', () => {
  test('offers vegetable harvest at end of non-harvest round', () => {
    const card = res.getCardById('lifting-machine-a070')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getVegetableFieldCount = () => 1
    game.isHarvestRound = () => false

    let offerCalled = false
    game.actions.offerLiftingMachine = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onRoundEnd(game, dennis, 2)

    expect(offerCalled).toBe(true)
  })

  test('does not offer at end of harvest round', () => {
    const card = res.getCardById('lifting-machine-a070')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getVegetableFieldCount = () => 1
    game.isHarvestRound = () => true

    let offerCalled = false
    game.actions.offerLiftingMachine = () => {
      offerCalled = true
    }

    card.onRoundEnd(game, dennis, 4)

    expect(offerCalled).toBe(false)
  })

  test('does not offer when no vegetable fields', () => {
    const card = res.getCardById('lifting-machine-a070')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getVegetableFieldCount = () => 0
    game.isHarvestRound = () => false

    let offerCalled = false
    game.actions.offerLiftingMachine = () => {
      offerCalled = true
    }

    card.onRoundEnd(game, dennis, 2)

    expect(offerCalled).toBe(false)
  })
})
