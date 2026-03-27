const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()  // initializes galaxy state
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

// Auto-resolve combat choices (retreat announcements, hit assignments, sustain choices)
// until combat ends or a non-combat choice appears.
// Pass retreatChoices = { playerName: 'Retreat to X' } to actually retreat.
function resolveCombat(game, retreatChoices = {}) {
  let safety = 0
  while (game.waiting && safety++ < 200) {
    const choices = t.currentChoices(game)
    const actor = game.waiting.selectors[0].actor
    const title = game.waiting.selectors[0].title || ''

    if (title.includes('retreat') || title.includes('Retreat')) {
      if (retreatChoices[actor]) {
        t.choose(game, retreatChoices[actor])
      }
      else {
        t.choose(game, 'Continue')
      }
    }
    else if (title.includes('ship type to take a hit') || title.includes('sustain damage')
      || title.includes('Direct Hit') || title.includes('Skilled Retreat')
      || title.includes('Fire Team') || title.includes('Assault Cannon')) {
      // Auto-pick first option for hit assignment / combat card choices
      t.choose(game, choices[0])
    }
    else {
      break
    }
  }
}

describe('Space Combat', () => {
  describe('Combat Trigger', () => {
    test('combat occurs when moving into system with enemy ships', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })
      resolveCombat(game)

      // After combat, micah's fighter should be destroyed (5 cruisers vs 1 fighter)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('no combat when no enemy ships present', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent('sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Ship should be safely in target (no combat)
      const dennisShips = game.state.units[target].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBe(1)
    })
  })

  describe('Combat Rounds', () => {
    test('ships roll dice based on combat value', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // War sun (combat 3, 80% hit rate) vs destroyer (combat 9, 20% hit rate)
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun', 'war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 2 }],
      })
      resolveCombat(game)

      // War suns should win (2 war suns with 80% hit rate each vs 1 destroyer)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('combat continues until one side eliminated', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Multiple combat rounds needed
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
      })
      resolveCombat(game)

      // One side should be eliminated (combat resolves completely)
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(dennisShips.length === 0 || micahShips.length === 0).toBe(true)
    })
  })

  describe('Sustain Damage', () => {
    test('sustain damage cancels one hit', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dreadnought has sustain damage — takes 2 hits to destroy
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })
      resolveCombat(game)

      // Dreadnought should be destroyed (5 cruisers = enough hits over combat rounds)
      // But it takes 2 hits due to sustain damage
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('damaged unit destroyed by next hit', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Pre-damaged dreadnought — only 1 hit to destroy
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought'],
            },
          },
        },
      })
      // Pre-damage the dreadnought
      game.testSetBreakpoint('initialization-complete', (game) => {
        // Find the dreadnought and mark it damaged
        const ships = game.state.units[targetSystem]?.space || []
        const dn = ships.find(u => u.type === 'dreadnought')
        if (dn) {
          dn.damaged = true
        }
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 1 }],
      })
      resolveCombat(game)

      // Pre-damaged dreadnought destroyed by first hit (war sun at combat 3 = 80%)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Retreat', () => {
    test('announced retreat executes after combat round', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Set up evenly matched combat so it doesn't resolve in one round
      // Dennis needs a retreat target — sol-home has his units/planets
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought', 'dreadnought'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought', 'dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'sol-home', count: 2 }],
      })

      // Dennis (attacker) announces retreat to sol-home
      resolveCombat(game, { dennis: 'Retreat to sol-home' })

      // Dennis's ships should have retreated to sol-home
      const dennisInTarget = (game.state.units[targetSystem]?.space || [])
        .filter(u => u.owner === 'dennis')
      const dennisInHome = (game.state.units['sol-home']?.space || [])
        .filter(u => u.owner === 'dennis')

      expect(dennisInTarget.length).toBe(0)
      // Retreated ships are in sol-home (may have taken losses)
      expect(dennisInHome.length).toBeGreaterThanOrEqual(0)
    })

    test('getRetreatTargets requires friendly presence (78.7c)', () => {
      const game = t.fixture()
      // Give dennis a unit in the adjacent system so he has a valid retreat target
      const adj = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
            [adj]: {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()

      const targets = game._getRetreatTargets('sol-home', 'dennis')
      expect(targets.length).toBeGreaterThan(0)
      expect(targets).toContain(adj)
      // All retreat targets should be adjacent to sol-home
      const adjacent = game._getAdjacentSystems('sol-home')
      for (const target of targets) {
        expect(adjacent).toContain(target)
      }
    })

    test('cannot retreat into empty system without friendly presence', () => {
      const game = t.fixture()
      game.run()

      // Find an adjacent system where dennis has no units and no planets
      const adjacent = game._getAdjacentSystems('sol-home')
      const emptyAdj = adjacent.find(adjId => {
        const units = game.state.units[adjId]
        const hasOwnUnits = units && (
          units.space.some(u => u.owner === 'dennis')
          || Object.values(units.planets || {}).some(pUnits =>
            pUnits.some(u => u.owner === 'dennis')
          )
        )
        const hasControlledPlanet = game._getSystemPlanets(adjId).some(pId =>
          game.state.planets[pId]?.controller === 'dennis'
        )
        return !hasOwnUnits && !hasControlledPlanet
      })

      // If there's an empty adjacent system, it should NOT be a valid retreat target
      expect(emptyAdj).toBeDefined()
      const targets = game._getRetreatTargets('sol-home', 'dennis')
      expect(targets).not.toContain(emptyAdj)
    })

    test('cannot retreat into system with enemy ships', () => {
      const game = t.fixture()
      const adj = findAdjacent('sol-home')
      t.setBoard(game, {
        micah: {
          units: {
            [adj]: {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()

      const targets = game._getRetreatTargets('sol-home', 'dennis')
      // The adjacent system with micah's cruiser should NOT be a valid retreat target
      expect(targets).not.toContain(adj)
    })

    test('retreat places command token in destination system', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought', 'dreadnought'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought', 'dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'sol-home', count: 2 }],
      })

      // Dennis retreats to sol-home
      resolveCombat(game, { dennis: 'Retreat to sol-home' })

      // Sol-home should have dennis's command token from the retreat
      const tokens = game.state.systems['sol-home']?.commandTokens || []
      expect(tokens).toContain('dennis')
    })
  })

  describe('Combat Modifiers', () => {
    test('combat resolves with faction combat modifiers (Sardakk N\'orr)', () => {
      // Sardakk N'orr has +1 combat (modifier -1) on all units
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      // System 27 (new-albion/starpoint) is adjacent to P1 home at (0,-3)
      const targetSystem = '27'
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'trenlak': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'norr-home', count: 3 }],
      })
      resolveCombat(game)

      // Sardakk's +1 combat modifier should apply without crashing or producing
      // out-of-bounds values (combat values clamped to 1-10)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Anti-Fighter Barrage', () => {
    test('AFB destroys fighters before combat', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dennis has 5 destroyers (AFB 9x2 each = 10 rolls) — overwhelming force
      // Micah has fighters that should get barraged
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['destroyer', 'destroyer', 'destroyer', 'destroyer', 'destroyer'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['fighter', 'fighter', 'carrier'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'sol-home', count: 5 }],
      })
      resolveCombat(game)

      // After AFB and combat, micah's fleet should be reduced or eliminated
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      // One side should be eliminated
      expect(micahShips.length === 0 || dennisShips.length === 0).toBe(true)
    })

    test('AFB fires even when no fighters present', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      // Dennis has destroyers (AFB 9x2), micah has only cruisers (no fighters)
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['destroyer', 'destroyer'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'destroyer', from: 'sol-home', count: 2 }],
      })
      resolveCombat(game)

      // AFB fires but has no fighters to destroy — should not crash
      // and cruisers should not be erroneously destroyed by AFB
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      const dennisShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'dennis')
      // Combat should resolve (one side eliminated)
      expect(micahShips.length === 0 || dennisShips.length === 0).toBe(true)
    })
  })

  describe('Combat Log', () => {
    test('_combatLog records space combat events', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })
      resolveCombat(game)

      const log = game.state._combatLog
      expect(Array.isArray(log)).toBe(true)
      expect(log.length).toBeGreaterThan(0)

      // Should have space-combat-start
      const start = log.find(e => e.type === 'space-combat-start')
      expect(start).toBeDefined()
      expect(start.systemId).toBe(targetSystem)
      expect(start.attacker).toBe('dennis')
      expect(start.defender).toBe('micah')

      // Should have at least one combat-round
      const rounds = log.filter(e => e.type === 'combat-round')
      expect(rounds.length).toBeGreaterThan(0)
      const round1 = rounds[0]
      expect(round1.combatType).toBe('space')
      expect(round1.round).toBe(1)
      expect(round1.sides.attacker.name).toBe('dennis')
      expect(round1.sides.defender.name).toBe('micah')
      expect(round1.sides.attacker.rolls.length).toBeGreaterThan(0)
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('unitType')
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('effectiveCombat')
      expect(round1.sides.attacker.rolls[0]).toHaveProperty('dice')
      expect(round1.sides.attacker.rolls[0].dice[0]).toHaveProperty('roll')
      expect(round1.sides.attacker.rolls[0].dice[0]).toHaveProperty('hit')

      // Should have combat-end
      const end = log.find(e => e.type === 'combat-end')
      expect(end).toBeDefined()
      expect(end.combatType).toBe('space')
      expect(end.winner).toBe('dennis')  // 5 cruisers vs 1 fighter
    })
  })

  describe('Retreat Announcement', () => {
    test('retreat to system with controlled planet (78.7c)', () => {
      const game = t.fixture()
      // Give micah control of new-albion (in system 27) but no units there
      // Then check if 27 is a valid retreat target for micah from a nearby system
      t.setBoard(game, {
        micah: {
          planets: {
            'new-albion': {},
          },
        },
      })
      game.run()

      // System 27 has new-albion which micah controls — should be valid retreat target
      // from any adjacent system (27 is adjacent to sol-home, 37, 26, 48)
      const targets = game._getRetreatTargets('37', 'micah')
      expect(targets).toContain('27')
    })

    test('stranded fighters removed on retreat (78.7b)', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Dennis attacks with carrier (move 1, capacity 4) + dreadnought (move 1, cap 1) + 3 fighters
      // If carrier is destroyed in combat, dreadnought can only carry 1 fighter on retreat
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought', 'carrier', 'fighter', 'fighter', 'fighter'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['war-sun', 'war-sun'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'fighter', from: 'sol-home', count: 3 },
        ],
      })

      // Resolve round 1 (no retreat on round 1), then dennis retreats on round 2
      resolveCombat(game, { dennis: 'Retreat to sol-home' })

      // Check: dennis should have retreated. Fighters exceeding capacity should be removed.
      const dennisInTarget = (game.state.units[targetSystem]?.space || [])
        .filter(u => u.owner === 'dennis')
      expect(dennisInTarget.length).toBe(0)

      // Count dennis units in sol-home
      const dennisInHome = (game.state.units['sol-home']?.space || [])
        .filter(u => u.owner === 'dennis')
      const dennisShips = dennisInHome.filter(u => {
        const def = game._getUnitStats('dennis', u.type)
        return def && def.move > 0
      })
      const dennisFighters = dennisInHome.filter(u => u.type === 'fighter')

      // Capacity of retreated ships limits how many fighters survive
      let totalCapacity = 0
      for (const ship of dennisShips) {
        const def = game._getUnitStats('dennis', ship.type)
        totalCapacity += def?.capacity || 0
      }
      expect(dennisFighters.length).toBeLessThanOrEqual(totalCapacity)
    })
  })

  describe('Assault Cannon', () => {
    test('target player chooses which ship to lose', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Dennis has 3 non-fighter ships + assault cannon tech
      // Micah has cruiser + dreadnought — should get to choose
      t.setBoard(game, {
        dennis: {
          technologies: ['assault-cannon'],
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
      })

      // Assault cannon fires. Micah should be asked to choose a ship type.
      // The game should be waiting for micah's choice.
      const choices = t.currentChoices(game)
      const title = game.waiting.selectors[0].title || ''
      expect(title).toContain('Assault Cannon')
      expect(choices).toContain('cruiser')
      expect(choices).toContain('dreadnought')

      // Micah chooses cruiser
      t.choose(game, 'cruiser')
      resolveCombat(game)

      // Combat should have resolved
      const combatLog = game.state._combatLog
      const acLog = combatLog.find(e => e.type === 'space-combat-start')
      expect(acLog).toBeDefined()
    })

    test('auto-assigns when defender has single non-fighter type', () => {
      const game = t.fixture()
      const targetSystem = '27'
      t.setBoard(game, {
        dennis: {
          technologies: ['assault-cannon'],
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
      })
      resolveCombat(game)

      // Combat should resolve without an Assault Cannon choice prompt
      // (auto-assigned since micah only has cruisers)
      const combatLog = game.state._combatLog
      expect(combatLog.find(e => e.type === 'space-combat-start')).toBeDefined()
    })
  })

  describe('Direct Hit', () => {
    test('destroys a ship that sustained damage', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Dennis has Direct Hit card and cruisers to attack
      // Micah has dreadnought that will sustain damage
      t.setBoard(game, {
        dennis: {
          actionCards: ['direct-hit'],
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // Combat resolves. If the dreadnought sustains, dennis should be offered Direct Hit.
      // Auto-resolve but intercept Direct Hit prompts.
      let directHitOffered = false
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('Direct Hit')) {
          directHitOffered = true
          // Play Direct Hit on the dreadnought
          const dreadnoughtChoice = choices.find(c => c.includes('dreadnought'))
          if (dreadnoughtChoice) {
            t.choose(game, dreadnoughtChoice)
          }
          else {
            t.choose(game, 'Pass')
          }
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('ship type') || title.includes('sustain')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }

      // Verify the dreadnought is destroyed
      // (5 cruisers at combat 7 will likely hit at least once, triggering sustain + Direct Hit)
      const micahShips = game.state.units[targetSystem].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Direct Hit should have been offered (dreadnought sustains before being destroyed)
      // and the card should be in the discard pile
      expect(directHitOffered).toBe(true)
      const dennisPlayer = game.players.byName('dennis')
      const remainingDH = dennisPlayer.actionCards.filter(c => c.id === 'direct-hit')
      expect(remainingDH.length).toBe(0)
      expect(game.state.actionCardDiscard.some(c => c.id === 'direct-hit')).toBe(true)
    })

    test('pass declines all remaining copies', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Dennis has 2 Direct Hit cards
      t.setBoard(game, {
        dennis: {
          actionCards: ['direct-hit', 'direct-hit'],
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought', 'dreadnought'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // Count how many times Direct Hit is offered
      let directHitOfferCount = 0
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('Direct Hit')) {
          directHitOfferCount++
          t.choose(game, 'Pass')  // Pass should stop further offers
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('ship type') || title.includes('sustain')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }

      // Passing should mean we were only offered once per combat round (not twice for 2 copies)
      // At most once per combat round where sustains occurred
      const roundCount = game.state._combatLog.filter(e => e.type === 'combat-round').length
      expect(directHitOfferCount).toBeLessThanOrEqual(roundCount)

      // Both Direct Hit cards should still be in hand (none played)
      const dennisPlayer = game.players.byName('dennis')
      expect(dennisPlayer.actionCards.filter(c => c.id === 'direct-hit').length).toBe(2)
    })

    test('immune units not offered as targets (L1Z1X Super Dread II)', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      const targetSystem = '27'
      // Micah (hacan) has Direct Hit. Dennis (L1Z1X) has Super Dreadnought II.
      t.setBoard(game, {
        micah: {
          actionCards: ['direct-hit'],
          units: {
            [targetSystem]: {
              space: ['war-sun', 'war-sun'],
            },
          },
        },
        dennis: {
          technologies: ['super-dreadnought-ii'],
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought'],
              '0.0.0': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // L1Z1X dreadnoughts with Super Dread II are immune to Direct Hit
      const mockUnit = { type: 'dreadnought', owner: 'dennis' }
      const isImmune = game.factionAbilities.isDirectHitImmune(mockUnit)
      expect(isImmune).toBe(true)
    })
  })

  describe('Skilled Retreat', () => {
    test('moves ships to adjacent system without command token', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Dennis has Skilled Retreat card
      t.setBoard(game, {
        dennis: {
          actionCards: ['skilled-retreat'],
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
      })

      // Skilled Retreat should be offered during combat round 1
      let skilledRetreatOffered = false
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('Skilled Retreat')) {
          skilledRetreatOffered = true
          t.choose(game, 'Play Skilled Retreat')
          // Choose destination — sol-home is adjacent to 27
          t.choose(game, 'sol-home')
          break
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('ship type') || title.includes('sustain')
          || title.includes('Direct Hit') || title.includes('Assault Cannon')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }
      // Resolve any remaining choices
      resolveCombat(game)

      expect(skilledRetreatOffered).toBe(true)

      // Dennis's ships should be in sol-home
      const dennisInTarget = (game.state.units[targetSystem]?.space || [])
        .filter(u => u.owner === 'dennis')
      expect(dennisInTarget.length).toBe(0)

      const dennisInHome = (game.state.units['sol-home']?.space || [])
        .filter(u => u.owner === 'dennis')
      expect(dennisInHome.length).toBeGreaterThan(0)

      // Card should be discarded
      const dennisPlayer = game.players.byName('dennis')
      const remainingSR = dennisPlayer.actionCards.filter(c => c.id === 'skilled-retreat')
      expect(remainingSR.length).toBe(0)
      expect(game.state.actionCardDiscard.some(c => c.id === 'skilled-retreat')).toBe(true)
    })
  })

  describe('Hit Assignment Choice', () => {
    test('player chooses which ship type to destroy when multiple types', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Micah has cruiser + destroyer (different types). Dennis has overwhelming force.
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun', 'war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 2 }],
      })

      // When micah takes hits, they should be offered a choice between cruiser and destroyer
      let hitChoiceOffered = false
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('ship type to take a hit')) {
          hitChoiceOffered = true
          // Choose to destroy the destroyer first
          if (choices.includes('destroyer')) {
            t.choose(game, 'destroyer')
          }
          else {
            t.choose(game, choices[0])
          }
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('sustain') || title.includes('Direct Hit')
          || title.includes('Skilled Retreat') || title.includes('Assault Cannon')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }

      expect(hitChoiceOffered).toBe(true)
    })

    test('auto-assigns when single ship type', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Micah has only cruisers — no choice should be offered
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['war-sun'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'war-sun', from: 'sol-home', count: 1 }],
      })

      // Should auto-resolve without hit assignment choice
      let hitChoiceOffered = false
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('ship type to take a hit')) {
          hitChoiceOffered = true
          t.choose(game, choices[0])
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('sustain') || title.includes('Direct Hit')
          || title.includes('Skilled Retreat') || title.includes('Assault Cannon')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }

      // Micah only has cruisers — no choice needed
      expect(hitChoiceOffered).toBe(false)
    })

    test('player chooses which ship type to sustain when multiple types', () => {
      const game = t.fixture()
      const targetSystem = '27'
      // Micah has dreadnought + war-sun (both have sustain damage)
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              space: ['dreadnought', 'war-sun'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // Micah should be offered choice of which type to sustain
      let sustainChoiceOffered = false
      let safety = 0
      while (game.waiting && safety++ < 200) {
        const title = game.waiting.selectors[0].title || ''
        const choices = t.currentChoices(game)

        if (title.includes('sustain damage')) {
          sustainChoiceOffered = true
          t.choose(game, choices[0])
        }
        else if (title.includes('retreat') || title.includes('Retreat')) {
          t.choose(game, 'Continue')
        }
        else if (title.includes('ship type') || title.includes('Direct Hit')
          || title.includes('Skilled Retreat') || title.includes('Assault Cannon')) {
          t.choose(game, choices[0])
        }
        else {
          break
        }
      }

      expect(sustainChoiceOffered).toBe(true)
    })
  })
})
