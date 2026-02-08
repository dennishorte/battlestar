const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Henpecked Husband (OccD 094)', () => {
  test('returns first worker home when taking build rooms with second person', () => {
    const card = res.getCardById('henpecked-husband-d094')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    dennis.getFirstPersonActionThisRound = () => 'take-wood'
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'build-rooms')

    expect(game.actions.returnWorkerHome).toHaveBeenCalledWith(dennis, 0)
  })

  test('does not return worker if first person was on meeting place', () => {
    const card = res.getCardById('henpecked-husband-d094')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    dennis.getFirstPersonActionThisRound = () => 'meeting-place'
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'build-rooms')

    expect(game.actions.returnWorkerHome).not.toHaveBeenCalled()
  })

  test('does not trigger when placing first person', () => {
    const card = res.getCardById('henpecked-husband-d094')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 1
    dennis.getFirstPersonActionThisRound = () => 'take-wood'
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'build-rooms')

    expect(game.actions.returnWorkerHome).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('henpecked-husband-d094')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPersonPlacedThisRound = () => 2
    dennis.getFirstPersonActionThisRound = () => 'take-wood'
    game.actions = { returnWorkerHome: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.returnWorkerHome).not.toHaveBeenCalled()
  })
})
