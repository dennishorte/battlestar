const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Twibil (E049)', () => {
  test('gives 1 food when any player builds wood room', () => {
    const card = res.getCardById('twibil-e049')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.food = 0

    card.onAnyBuildRoom(game, dennis, micah, 'wood')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when owner builds wood room', () => {
    const card = res.getCardById('twibil-e049')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAnyBuildRoom(game, dennis, dennis, 'wood')

    expect(dennis.food).toBe(1)
  })

  test('does not give food for clay rooms', () => {
    const card = res.getCardById('twibil-e049')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.food = 0

    card.onAnyBuildRoom(game, dennis, micah, 'clay')

    expect(dennis.food).toBe(0)
  })

  test('does not give food for stone rooms', () => {
    const card = res.getCardById('twibil-e049')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.food = 0

    card.onAnyBuildRoom(game, dennis, micah, 'stone')

    expect(dennis.food).toBe(0)
  })

  test('has 1 vps', () => {
    const card = res.getCardById('twibil-e049')
    expect(card.vps).toBe(1)
  })
})
