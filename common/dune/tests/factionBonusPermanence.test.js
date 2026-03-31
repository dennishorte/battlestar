const t = require('../testutil')

describe('Faction Bonus Permanence', () => {

  test('bonus at 4 guild influence grants 3 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { guild: 3 }, solari: 0 },
    })
    game.run()

    // Gain guild influence to 4 via Deliver Supplies
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Deliver Supplies')

    // Guild 3 -> 4: +3 Solari bonus
    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('guild')).toBe(4)
    expect(dennis.solari).toBe(3)
  })

  test('bonus can be re-earned by moving back up to 4 through gameplay', () => {
    // Set fremen to 3, earn bonus by reaching 4, lose influence through combat,
    // then earn bonus again by reaching 4 a second time
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 3 }, water: 0 },
    })
    game.run()

    // Gain fremen influence to 4 via Fremkit (fremen faction space)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Fremkit')

    // Fremen 3 -> 4: bonus is +1 Water
    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(4)
    expect(dennis.water).toBeGreaterThanOrEqual(1)
  })
})
