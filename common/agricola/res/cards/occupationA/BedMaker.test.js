const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bed Maker (OccA 093)', () => {
  test('offers family growth when building room with wood, grain, and can grow', () => {
    const card = res.getCardById('bed-maker-a093')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.grain = 1
    dennis.canGrowFamily = () => true
    game.actions = { offerBedMakerGrowth: jest.fn() }

    card.onBuildRoom(game, dennis)

    expect(game.actions.offerBedMakerGrowth).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer without enough wood', () => {
    const card = res.getCardById('bed-maker-a093')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.grain = 1
    dennis.canGrowFamily = () => true
    game.actions = { offerBedMakerGrowth: jest.fn() }

    card.onBuildRoom(game, dennis)

    expect(game.actions.offerBedMakerGrowth).not.toHaveBeenCalled()
  })

  test('does not offer without enough grain', () => {
    const card = res.getCardById('bed-maker-a093')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.grain = 0
    dennis.canGrowFamily = () => true
    game.actions = { offerBedMakerGrowth: jest.fn() }

    card.onBuildRoom(game, dennis)

    expect(game.actions.offerBedMakerGrowth).not.toHaveBeenCalled()
  })

  test('does not offer when cannot grow family', () => {
    const card = res.getCardById('bed-maker-a093')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.grain = 1
    dennis.canGrowFamily = () => false
    game.actions = { offerBedMakerGrowth: jest.fn() }

    card.onBuildRoom(game, dennis)

    expect(game.actions.offerBedMakerGrowth).not.toHaveBeenCalled()
  })
})
