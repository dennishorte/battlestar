const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Godly Spouse (OccD 150)', () => {
  test('returns first worker home when taking family growth with second person', () => {
    const card = res.getCardById('godly-spouse-d150')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'family-growth')

    expect(game.actions.returnWorkerHome).toHaveBeenCalledWith(dennis, 0)
  })

  test('returns first worker home when taking urgent family growth with second person', () => {
    const card = res.getCardById('godly-spouse-d150')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'family-growth-urgent')

    expect(game.actions.returnWorkerHome).toHaveBeenCalledWith(dennis, 0)
  })

  test('does not trigger when placing first person', () => {
    const card = res.getCardById('godly-spouse-d150')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 1
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'family-growth')

    expect(game.actions.returnWorkerHome).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('godly-spouse-d150')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.returnWorkerHome).not.toHaveBeenCalled()
  })
})
