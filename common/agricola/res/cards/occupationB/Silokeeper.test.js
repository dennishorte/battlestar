const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Silokeeper (B112)', () => {
  test('gives 1 grain when using action space from pre-harvest round', () => {
    const card = res.getCardById('silokeeper-b112')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.lastHarvestRound = 4

    const dennis = t.player(game)
    dennis.grain = 0
    game.getActionSpaceRound = jest.fn().mockReturnValue(4)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain for actions from other rounds', () => {
    const card = res.getCardById('silokeeper-b112')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.lastHarvestRound = 4

    const dennis = t.player(game)
    dennis.grain = 0
    game.getActionSpaceRound = jest.fn().mockReturnValue(5)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.grain).toBe(0)
  })

  test('does not give grain when no harvest has occurred', () => {
    const card = res.getCardById('silokeeper-b112')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.lastHarvestRound = 0

    const dennis = t.player(game)
    dennis.grain = 0
    game.getActionSpaceRound = jest.fn().mockReturnValue(4)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.grain).toBe(0)
  })
})
