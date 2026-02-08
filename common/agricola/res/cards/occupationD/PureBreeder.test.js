const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pure Breeder (OccD 167)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('pure-breeder-d167')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('offers breeding at end of non-harvest round', () => {
    const card = res.getCardById('pure-breeder-d167')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.isHarvestRound = () => false
    game.actions = { offerPureBreederBreeding: jest.fn() }

    card.onRoundEnd(game, dennis, 3)

    expect(game.actions.offerPureBreederBreeding).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer breeding at end of harvest round', () => {
    const card = res.getCardById('pure-breeder-d167')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.isHarvestRound = () => true
    game.actions = { offerPureBreederBreeding: jest.fn() }

    card.onRoundEnd(game, dennis, 4)

    expect(game.actions.offerPureBreederBreeding).not.toHaveBeenCalled()
  })
})
