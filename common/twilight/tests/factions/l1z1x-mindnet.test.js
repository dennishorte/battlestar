const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('L1Z1X Mindnet', () => {
  describe('Assimilate', () => {
    test('replaces enemy PDS and docks when gaining planet', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // System 27 = New Albion + Starpoint — use 37 = Arinam + Meer for different planet
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['carrier', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'pds', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (L1Z1X) moves 2 carriers + 6 infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'l1z1x-home', count: 2 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 6 },
        ],
      })

      // After ground combat (dennis wins 6 infantry vs 1 + structures)
      // L1Z1X assimilate should replace enemy PDS and space dock
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Check structures belong to dennis now
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)

      // Should have assimilated PDS and space dock
      expect(newAlbion).toContain('pds')
      expect(newAlbion).toContain('space-dock')
    })
  })

  describe('Harrow', () => {
    test('non-fighter ships bombard during ground combat rounds', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // L1Z1X invades with 2 dreadnoughts (bombardment) + carrier with infantry
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
        ],
      })

      // Ground combat with Harrow: 2 dreadnoughts bombard (5x1 each) every round
      // Plus regular bombardment before combat, plus 4 infantry in ground combat
      // L1Z1X should overwhelm 5 defending infantry
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('dennis')
    })
  })
})
