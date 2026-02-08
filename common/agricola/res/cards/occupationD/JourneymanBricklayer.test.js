const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Journeyman Bricklayer (OccD 163)', () => {
  test('gives 2 stone on play', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.stone).toBe(2)
  })

  test('gives 1 stone when another player renovates to stone', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.stone = 0

    card.onAnyRenovate(game, micah, dennis, null, 'stone')

    expect(dennis.stone).toBe(1)
  })

  test('does not give stone when card owner renovates to stone', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onAnyRenovate(game, dennis, dennis, null, 'stone')

    expect(dennis.stone).toBe(0)
  })

  test('does not give stone when another player renovates to clay', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.stone = 0

    card.onAnyRenovate(game, micah, dennis, null, 'clay')

    expect(dennis.stone).toBe(0)
  })

  test('gives 1 stone when another player builds a stone room', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.stone = 0

    card.onAnyBuildRoom(game, micah, dennis, 'stone')

    expect(dennis.stone).toBe(1)
  })

  test('does not give stone when card owner builds a stone room', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onAnyBuildRoom(game, dennis, dennis, 'stone')

    expect(dennis.stone).toBe(0)
  })

  test('does not give stone when another player builds a wood room', () => {
    const card = res.getCardById('journeyman-bricklayer-d163')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.stone = 0

    card.onAnyBuildRoom(game, micah, dennis, 'wood')

    expect(dennis.stone).toBe(0)
  })
})
