const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Patch Caregiver (B113)', () => {
  test('adds virtual field on play', () => {
    const card = res.getCardById('patch-caregiver-b113')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.addVirtualField = jest.fn()
    game.actions = { offerPatchCaregiverChoice: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.addVirtualField).toHaveBeenCalledWith({
      cardId: 'patch-caregiver-b113',
      label: 'Patch Caregiver',
      cropRestriction: null,
    })
  })

  test('offers grain or vegetable purchase on play', () => {
    const card = res.getCardById('patch-caregiver-b113')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.addVirtualField = jest.fn()
    game.actions = { offerPatchCaregiverChoice: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerPatchCaregiverChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('has isField flag', () => {
    const card = res.getCardById('patch-caregiver-b113')
    expect(card.isField).toBe(true)
  })
})
