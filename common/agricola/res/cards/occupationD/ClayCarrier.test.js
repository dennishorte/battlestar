const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Carrier (OccD 122)', () => {
  test('gives 2 clay on play', () => {
    const card = res.getCardById('clay-carrier-d122')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(2)
  })

  test('can buy clay when player has 2 food and has not used this round', () => {
    const card = res.getCardById('clay-carrier-d122')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    card.lastUsedRound = 0

    expect(card.canBuyClay(dennis, 1)).toBe(true)
  })

  test('cannot buy clay when player has less than 2 food', () => {
    const card = res.getCardById('clay-carrier-d122')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1

    expect(card.canBuyClay(dennis, 1)).toBe(false)
  })

  test('cannot buy clay if already used this round', () => {
    const card = res.getCardById('clay-carrier-d122')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    card.lastUsedRound = 3

    expect(card.canBuyClay(dennis, 3)).toBe(false)
  })

  test('buyClay exchanges 2 food for 2 clay', () => {
    const card = res.getCardById('clay-carrier-d122')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.clay = 0
    game.state.round = 3

    card.buyClay(game, dennis)

    expect(dennis.food).toBe(3)
    expect(dennis.clay).toBe(2)
    expect(card.lastUsedRound).toBe(3)
  })

  test('has oncePerRound flag', () => {
    const card = res.getCardById('clay-carrier-d122')
    expect(card.oncePerRound).toBe(true)
  })

  test('has allowsAnytimeAction flag', () => {
    const card = res.getCardById('clay-carrier-d122')
    expect(card.allowsAnytimeAction).toBe(true)
  })
})
