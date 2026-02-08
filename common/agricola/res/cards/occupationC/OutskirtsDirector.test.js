const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Outskirts Director (C130)', () => {
  test('offers bonus when using copse action', () => {
    const card = res.getCardById('outskirts-director-c130')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerOutskirtsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerOutskirtsDirectorBonus).toHaveBeenCalledWith(
      dennis,
      card,
      'take-clay-2'
    )
  })

  test('offers bonus when using take-clay-2 action', () => {
    const card = res.getCardById('outskirts-director-c130')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerOutskirtsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'take-clay-2')

    expect(game.actions.offerOutskirtsDirectorBonus).toHaveBeenCalledWith(
      dennis,
      card,
      'copse'
    )
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('outskirts-director-c130')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerOutskirtsDirectorBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerOutskirtsDirectorBonus).not.toHaveBeenCalled()
  })
})
