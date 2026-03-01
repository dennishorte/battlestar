const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Elimination', () => {
  test('player eliminated when no ground forces, no production, no planets', () => {
    const game = t.fixture()
    // Dennis has only 1 infantry on Jord, Micah invades with 5
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'sol-home': {
            'jord': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'sol-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      for (let i = 0; i < 5; i++) {
        g.state.units['sol-home'].space.push({
          id: `micah-inf-${i}`,
          type: 'infantry',
          owner: 'micah',
        })
      }
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Micah (leadership=1) goes first with tactical action on sol-home
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'sol-home' })
    t.action(game, 'move-ships', { movements: [] })

    // After combat, micah takes jord — dennis should be eliminated
    expect(game.state.eliminatedPlayers).toContain('dennis')
  })

  test('player NOT eliminated when they still have a space dock', () => {
    const game = t.fixture()
    // Dennis has space dock but no ground forces, loses planet but keeps dock on another planet
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'sol-home': {
            'jord': ['infantry', 'space-dock'],
          },
        },
      },
    })
    game.run()

    // Dennis has a space dock (production unit), so should not be eliminated
    // even if we hypothetically removed his infantry
    expect(game.state.eliminatedPlayers).not.toContain('dennis')
  })

  test('eliminated player is skipped in action phase and strategy phase', () => {
    const game = t.fixture()
    t.setBoard(game, {
      eliminatedPlayers: ['micah'],
    })
    game.run()
    // Only Dennis picks a strategy card (micah is eliminated)
    t.choose(game, 'leadership')

    // Dennis should get the action prompt
    expect(game.waiting.selectors[0].actor).toBe('dennis')

    // Dennis uses leadership
    t.choose(game, 'Strategic Action')
    // No secondary prompt for micah (eliminated)
    // Dennis should be prompted for next action (or pass)
    expect(game.waiting.selectors[0].actor).toBe('dennis')
  })

  test('speaker passes to next player when speaker is eliminated', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'sol-home': {
            'jord': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'sol-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      // Ensure dennis is speaker
      g.state.speaker = 'dennis'
      for (let i = 0; i < 5; i++) {
        g.state.units['sol-home'].space.push({
          id: `micah-inf-${i}`,
          type: 'infantry',
          owner: 'micah',
        })
      }
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Micah goes first, invades sol-home, eliminates dennis
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'sol-home' })
    t.action(game, 'move-ships', { movements: [] })

    // Dennis was speaker, now eliminated → speaker should pass to micah
    expect(game.state.eliminatedPlayers).toContain('dennis')
    expect(game.state.speaker).toBe('micah')
  })

  test('promissory notes returned to owners when player eliminated', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        promissoryNotes: [{ id: 'trade-agreement', owner: 'micah' }],
        units: {
          'sol-home': {
            'jord': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'sol-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      for (let i = 0; i < 5; i++) {
        g.state.units['sol-home'].space.push({
          id: `micah-inf-${i}`,
          type: 'infantry',
          owner: 'micah',
        })
      }
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Micah invades and eliminates dennis
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'sol-home' })
    t.action(game, 'move-ships', { movements: [] })

    expect(game.state.eliminatedPlayers).toContain('dennis')
    // Micah's promissory note should be returned
    const micah = game.players.byName('micah')
    const hasTrade = micah.getPromissoryNotes().some(n => n.id === 'trade-agreement')
    expect(hasTrade).toBe(true)
  })
})


// ---------------------------------------------------------------------------
// Faction-specific elimination rules (Rule 33.10)
// ---------------------------------------------------------------------------

function addInvadingInfantry(g, systemId) {
  for (let i = 0; i < 5; i++) {
    g.state.units[systemId].space.push({
      id: `micah-inf-${i}`,
      type: 'infantry',
      owner: 'micah',
    })
  }
}

describe('Faction-Specific Elimination', () => {
  test('Creuss wormhole token persists after elimination', () => {
    const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'creuss-home': {
            'creuss': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'creuss-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.state.creussWormholeToken = '27'
      addInvadingInfantry(g, 'creuss-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'creuss-home' })
    t.action(game, 'move-ships', { movements: [] })

    expect(game.state.eliminatedPlayers).toContain('dennis')
    expect(game.state.creussWormholeToken).toBe('27')
  })

  test('Nekro assimilator tokens persist after elimination', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'nekro-home': {
            'mordai-ii': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'nekro-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.state.assimilatorTokens = {
        x: { techId: 'neural-motivator', ownerName: 'micah' },
      }
      addInvadingInfantry(g, 'nekro-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'nekro-home' })
    t.action(game, 'move-ships', { movements: [] })

    // Nekro's Technological Singularity: decline to copy tech
    t.choose(game, 'Pass')

    expect(game.state.eliminatedPlayers).toContain('dennis')
    expect(game.state.assimilatorTokens.x).toEqual({
      techId: 'neural-motivator',
      ownerName: 'micah',
    })
  })

  test('Titans sleeper tokens persist after elimination', () => {
    const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
    t.setBoard(game, {
      sleeperTokens: { 'wellon': 'dennis' },
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'titans-home': {
            'elysium': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'titans-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      addInvadingInfantry(g, 'titans-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'titans-home' })
    t.action(game, 'move-ships', { movements: [] })

    expect(game.state.eliminatedPlayers).toContain('dennis')
    expect(game.state.sleeperTokens['wellon']).toBe('dennis')
  })

  test('Mahact captured command tokens returned to owners on elimination', () => {
    const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
    t.setBoard(game, {
      capturedCommandTokens: { dennis: ['micah'] },
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'mahact-home': {
            'ixth': ['infantry'],
          },
        },
      },
      micah: {
        commandTokens: { tactics: 3, strategy: 2, fleet: 2 },
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'mahact-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      addInvadingInfantry(g, 'mahact-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'mahact-home' })
    t.action(game, 'move-ships', { movements: [] })

    // Mahact's Crimson Legionnaire mech: decline commodity
    t.choose(game, 'Decline')

    expect(game.state.eliminatedPlayers).toContain('dennis')
    // Micah spent 1 tactic (activation) but got 1 back (returned token) → net 3
    const micah = game.players.byName('micah')
    expect(micah.commandTokens.tactics).toBe(3)
    expect(game.state.capturedCommandTokens['dennis']).toEqual([])
  })

  test('Gift of Prescience returned to Naalu when holder is eliminated', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'sol-home': {
            'jord': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'sol-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      // Dennis holds GoP, micah is the Naalu owner
      g.state._giftOfPrescience = { holder: 'dennis', owner: 'micah' }
      addInvadingInfantry(g, 'sol-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Dennis has GoP (initiative 0), goes first — do a harmless tactical action
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', { movements: [] })

    // Micah invades sol-home
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'sol-home' })
    t.action(game, 'move-ships', { movements: [] })

    expect(game.state.eliminatedPlayers).toContain('dennis')
    expect(game.state._giftOfPrescience).toBeNull()
    // Micah (PN owner) should have GoP back
    const micah = game.players.byName('micah')
    const hasGoP = micah.getPromissoryNotes().some(n => n.id === 'gift-of-prescience')
    expect(hasGoP).toBe(true)
  })

  test('Gift of Prescience persists when Naalu owner is eliminated', () => {
    const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        units: {
          'naalu-home': {
            'maaluuk': ['infantry'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'naalu-home': {
            space: ['carrier'],
          },
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      // Micah holds GoP, dennis (Naalu) is the owner
      g.state._giftOfPrescience = { holder: 'micah', owner: 'dennis' }
      // Clear dennis's control of druaa so elimination triggers with only maaluuk lost
      g.state.planets['druaa'].controller = null
      addInvadingInfantry(g, 'naalu-home')
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Micah has GoP (initiative 0), goes first — invades naalu-home
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'naalu-home' })
    t.action(game, 'move-ships', { movements: [] })

    expect(game.state.eliminatedPlayers).toContain('dennis')
    // GoP should persist — holder (micah) keeps initiative 0
    expect(game.state._giftOfPrescience).toEqual({ holder: 'micah', owner: 'dennis' })
  })
})
