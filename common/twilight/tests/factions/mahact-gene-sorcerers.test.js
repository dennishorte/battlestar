const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Mahact Gene-Sorcerers', () => {
  test('gains command token after combat win', () => {
    const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'mahact-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'ixth': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          '27': {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'mahact-home', count: 5 }],
    })

    // Mahact wins combat — Edict: capture Hacan command token
    const captured = game.state.capturedCommandTokens['dennis'] || []
    expect(captured).toContain('micah')
  })

  describe('Imperia', () => {
    test('Mahact can use captured player commander effects', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      // Should have Mahact's own commander (not in registry) + Sardakk captured commander
      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeDefined()
      expect(sardakkEffect.timing).toBe('combat-modifier')
    })

    test('imperia only works with unlocked captured commander', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        // micah's commander is locked
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      // Sardakk commander locked — not available
      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeUndefined()
    })

    test('imperia stops when captured token returned', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      // Remove captured token (simulate return)
      game.state.capturedCommandTokens['dennis'] = []

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeUndefined()
    })

    test('Mahact gets combat modifier from captured Sardakk commander', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(1)  // Sardakk commander bonus
    })
  })
})
