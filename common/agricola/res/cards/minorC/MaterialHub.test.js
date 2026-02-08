const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Material Hub (C081)', () => {
  test('places resources on card on play', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.materialHubResources).toEqual({ wood: 2, clay: 2, reed: 2, stone: 2 })
  })

  test('gives resource when any player takes enough wood', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    dennis.wood = 0

    card.onAnyAction(game, micah, 'take-wood', dennis, { woodTaken: 5 })

    expect(dennis.materialHubResources.wood).toBe(1)
    expect(dennis.wood).toBe(1)
  })

  test('gives resource when any player takes enough clay', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    dennis.clay = 0

    card.onAnyAction(game, micah, 'take-clay', dennis, { clayTaken: 4 })

    expect(dennis.materialHubResources.clay).toBe(1)
    expect(dennis.clay).toBe(1)
  })

  test('gives resource when any player takes enough reed', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    dennis.reed = 0

    card.onAnyAction(game, dennis, 'take-reed', dennis, { reedTaken: 3 })

    expect(dennis.materialHubResources.reed).toBe(1)
    expect(dennis.reed).toBe(1)
  })

  test('gives resource when any player takes enough stone', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    dennis.stone = 0

    card.onAnyAction(game, dennis, 'take-stone', dennis, { stoneTaken: 3 })

    expect(dennis.materialHubResources.stone).toBe(1)
    expect(dennis.stone).toBe(1)
  })

  test('does not give resource when below threshold', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    dennis.wood = 0

    card.onAnyAction(game, dennis, 'take-wood', dennis, { woodTaken: 4 })

    expect(dennis.materialHubResources.wood).toBe(2)
    expect(dennis.wood).toBe(0)
  })

  test('does not give resource when card resources depleted', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.materialHubResources = { wood: 0, clay: 2, reed: 2, stone: 2 }
    dennis.wood = 0

    card.onAnyAction(game, dennis, 'take-wood', dennis, { woodTaken: 5 })

    expect(dennis.materialHubResources.wood).toBe(0)
    expect(dennis.wood).toBe(0)
  })

  test('does nothing when materialHubResources not set', () => {
    const card = res.getCardById('material-hub-c081')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAnyAction(game, dennis, 'take-wood', dennis, { woodTaken: 5 })

    expect(dennis.wood).toBe(0)
  })
})
