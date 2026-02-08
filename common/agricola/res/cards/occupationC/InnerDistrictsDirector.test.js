const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Inner Districts Director (C093)', () => {
  test('offers bonus when using take-wood action', () => {
    const card = res.getCardById('inner-districts-director-c093')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerInnerDistrictsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerInnerDistrictsDirectorBonus).toHaveBeenCalledWith(
      dennis,
      card,
      'take-clay'
    )
  })

  test('offers bonus when using take-clay action', () => {
    const card = res.getCardById('inner-districts-director-c093')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerInnerDistrictsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerInnerDistrictsDirectorBonus).toHaveBeenCalledWith(
      dennis,
      card,
      'take-wood'
    )
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('inner-districts-director-c093')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerInnerDistrictsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'take-stone-1')

    expect(game.actions.offerInnerDistrictsDirectorBonus).not.toHaveBeenCalled()
  })
})
