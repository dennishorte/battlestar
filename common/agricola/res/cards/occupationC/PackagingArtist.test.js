const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Packaging Artist (C140)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('packaging-artist-c140')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('offers bake bread choice on minor improvement action', () => {
    const card = res.getCardById('packaging-artist-c140')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPackagingArtistChoice: jest.fn() }

    card.onMinorImprovementAction(game, dennis)

    expect(game.actions.offerPackagingArtistChoice).toHaveBeenCalledWith(dennis, card)
  })
})
