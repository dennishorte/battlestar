const t = require('../../testutil.js')
const leader = require('./PrincessYunaMoritani.js')

describe('Princess Yuna Moritani', () => {
  test('data', () => {
    expect(leader.name).toBe('Princess Yuna Moritani')
  })

  test('Smuggling Operation starts with no water', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(0)
  })

  test('Final Delivery recruits a troop from supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      dennis: { solari: 7, hand: ['Signet Ring'], influence: { emperor: 0 } },
    })
    game.run()

    const supplyBefore = game.players.byName('dennis').troopsInSupply
    const garrisonBefore = game.players.byName('dennis').troopsInGarrison

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Pay 7 Solari → +1 Influence, +1 Troop, +1 Spice')
    t.choose(game, 'emperor')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.spice).toBe(1)
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.troopsInSupply).toBe(supplyBefore - 1)
    expect(dennis.troopsInGarrison).toBe(garrisonBefore + 1)
  })
})
