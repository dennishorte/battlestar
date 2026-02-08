const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Spin Doctor (OccD 151)', () => {
  test('offers placement when using traveling-players with available worker', () => {
    const card = res.getCardById('spin-doctor-d151')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.hasAvailableWorker = () => true
    game.actions = { offerSpinDoctorPlacement: jest.fn() }

    card.onAction(game, dennis, 'traveling-players')

    expect(game.actions.offerSpinDoctorPlacement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer placement without available worker', () => {
    const card = res.getCardById('spin-doctor-d151')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.hasAvailableWorker = () => false
    game.actions = { offerSpinDoctorPlacement: jest.fn() }

    card.onAction(game, dennis, 'traveling-players')

    expect(game.actions.offerSpinDoctorPlacement).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('spin-doctor-d151')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.hasAvailableWorker = () => true
    game.actions = { offerSpinDoctorPlacement: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerSpinDoctorPlacement).not.toHaveBeenCalled()
  })
})
