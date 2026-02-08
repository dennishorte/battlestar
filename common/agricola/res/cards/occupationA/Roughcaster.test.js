const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Roughcaster (OccA 110)', () => {
  test('gives 3 food when building clay room', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildRoom(game, dennis, 'clay')

    expect(dennis.food).toBe(3)
  })

  test('does not give food when building wooden room', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildRoom(game, dennis, 'wood')

    expect(dennis.food).toBe(0)
  })

  test('does not give food when building stone room', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildRoom(game, dennis, 'stone')

    expect(dennis.food).toBe(0)
  })

  test('gives 3 food when renovating from clay to stone', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(dennis.food).toBe(3)
  })

  test('does not give food when renovating from wood to clay', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onRenovate(game, dennis, 'wood', 'clay')

    expect(dennis.food).toBe(0)
  })

  test('does not give food when renovating from wood to stone', () => {
    const card = res.getCardById('roughcaster-a110')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onRenovate(game, dennis, 'wood', 'stone')

    expect(dennis.food).toBe(0)
  })
})
