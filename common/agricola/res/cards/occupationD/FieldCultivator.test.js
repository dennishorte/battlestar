const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Cultivator (OccD 126)', () => {
  test('initializes pile with correct resources on play', () => {
    const card = res.getCardById('field-cultivator-d126')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.pile).toEqual(['wood', 'clay', 'reed', 'stone', 'reed', 'clay', 'wood'])
  })

  test('gives top resource from pile when harvesting field', () => {
    const card = res.getCardById('field-cultivator-d126')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.pile = ['wood', 'clay', 'reed']

    card.onHarvestField(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(card.pile).toEqual(['clay', 'reed'])
  })

  test('gives second resource on second harvest', () => {
    const card = res.getCardById('field-cultivator-d126')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    card.pile = ['wood', 'clay', 'reed']

    card.onHarvestField(game, dennis)
    card.onHarvestField(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(1)
    expect(card.pile).toEqual(['reed'])
  })

  test('does nothing when pile is empty', () => {
    const card = res.getCardById('field-cultivator-d126')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.pile = []

    card.onHarvestField(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('handles undefined pile', () => {
    const card = res.getCardById('field-cultivator-d126')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.pile = undefined

    card.onHarvestField(game, dennis)

    expect(dennis.wood).toBe(0)
  })
})
