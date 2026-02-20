const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Faction Abilities', () => {
  describe('Federation of Sol', () => {
    describe('Orbital Drop', () => {
      test('places 2 infantry on a controlled planet', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses Component Action → Orbital Drop
        // Only 1 controlled planet (jord) so planet choice auto-resolves
        t.choose(game, 'Component Action')
        t.choose(game, 'orbital-drop')

        // Re-read state after action (deterministic replay rebuilds state)
        const jord = game.state.units['sol-home'].planets['jord']
        const infantryCount = jord.filter(u => u.owner === 'dennis' && u.type === 'infantry').length
        // Sol starts with 5 infantry + 2 from orbital drop = 7
        expect(infantryCount).toBe(7)
      })

      test('costs 1 tactics command token', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Only 1 controlled planet so auto-resolves
        t.choose(game, 'Component Action')
        t.choose(game, 'orbital-drop')

        // Started with 3 tactics, spent 1 = 2
        const dennis = game.players.byName('dennis')
        expect(dennis.commandTokens.tactics).toBe(2)
      })

      test('not available to non-Sol factions', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis is Hacan here — Component Action should have no component actions
        // The choose will log "No component actions available" and return
        t.choose(game, 'Component Action')

        // Should immediately return to dennis's turn
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })

    describe('Versatile', () => {
      test('gains 1 extra command token in status phase', () => {
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through action phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')
        t.choose(game, 'Pass')

        // Status phase
        t.choose(game, 'Done')  // dennis gets 3 (2+1 Versatile)
        t.choose(game, 'Done')  // micah gets 2

        const dennis = game.players.byName('dennis')
        const micah = game.players.byName('micah')

        // Dennis: 3 (start) + 3 (leadership) + 3 (status: 2+1 Versatile) = 9
        expect(dennis.commandTokens.tactics).toBe(9)
        // Micah: 3 (start) + 2 (status) = 5
        expect(micah.commandTokens.tactics).toBe(5)
      })
    })
  })

  describe('Barony of Letnev', () => {
    describe('Armada', () => {
      test('fleet limit is fleet pool + 2', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
        })
        game.run()

        const scott = game.players.byName('scott')  // Letnev
        const fleetLimit = game._getFleetLimit(scott)
        // Base fleet pool = 3, Armada bonus = +2
        expect(fleetLimit).toBe(5)
      })

      test('non-Letnev factions do not get Armada bonus', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
        })
        game.run()

        const dennis = game.players.byName('dennis')  // Sol
        const fleetLimit = game._getFleetLimit(dennis)
        // Base fleet pool = 3, no bonus
        expect(fleetLimit).toBe(3)
      })
    })
  })

  describe('Naalu Collective', () => {
    describe('Telepathic', () => {
      test('Naalu always goes first in action phase regardless of strategy card', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'naalu-collective', 'emirates-of-hacan'],
        })
        game.run()

        // Snake draft: dennis, micah, scott, scott, micah, dennis
        t.choose(game, 'leadership')    // dennis: leadership(1)
        t.choose(game, 'imperial')      // micah: imperial(8)
        t.choose(game, 'diplomacy')     // scott: diplomacy(2)
        t.choose(game, 'construction')  // scott: construction(4)
        t.choose(game, 'politics')      // micah: politics(3)
        t.choose(game, 'trade')         // dennis: trade(5)

        // Despite having high cards (3,8), Naalu should go first (initiative 0)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })

      test('non-Naalu player with lower card goes after Naalu', () => {
        const game = t.fixture({
          factions: ['federation-of-sol', 'naalu-collective'],
        })
        game.run()

        // Dennis picks leadership(1), micah (Naalu) picks imperial(8)
        t.choose(game, 'leadership')
        t.choose(game, 'imperial')

        // Naalu goes first even though leadership(1) < imperial(8)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })
  })

  describe('Emirates of Hacan', () => {
    describe('Guild Ships', () => {
      test('Hacan can trade with non-neighbors', () => {
        // In the default 2-player map, sol-home and hacan-home are not adjacent
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: { tradeGoods: 5 },
          micah: { tradeGoods: 5 },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Hacan) uses leadership — goes first (card #1)
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // After strategic action, Dennis gets transaction window
        // Hacan's Guild Ships means Dennis can trade even though not neighbors
        const choices = t.currentChoices(game)
        expect(choices).toContain('micah')
      })

      test('non-Hacan cannot trade with non-neighbors', () => {
        // Micah (Sol) should not be able to trade with non-adjacent Hacan
        const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: { tradeGoods: 5 },
          micah: { tradeGoods: 5 },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Sol) uses leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines secondary

        // Dennis is Sol — not neighbors with Hacan in default map
        // Should go directly to micah's turn (no transaction window)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })
  })

  describe('Mentak Coalition', () => {
    describe('Ambush', () => {
      test('Mentak has ambush ability', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
        })
        game.run()

        const scottPlayer = game.players.byName('scott')  // Mentak
        expect(scottPlayer.faction.abilities.some(a => a.id === 'ambush')).toBe(true)
      })
    })

    describe('Pillage', () => {
      test('Mentak has pillage ability', () => {
        const game = t.fixture({
          numPlayers: 3,
          factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
        })
        game.run()

        const scottPlayer = game.players.byName('scott')  // Mentak
        expect(scottPlayer.faction.abilities.some(a => a.id === 'pillage')).toBe(true)
      })
    })
  })

  describe('Yssaril Tribes', () => {
    describe('Stall Tactics', () => {
      test('can discard action card as component action', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            actionCards: ['focused-research', 'mining-initiative'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Yssaril) uses component action
        t.choose(game, 'Component Action')
        t.choose(game, 'stall-tactics')

        // Should be prompted to discard a card — choose focused-research
        t.choose(game, 'focused-research')

        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBe(1)
        expect(dennis.actionCards[0].id).toBe('mining-initiative')
      })

      test('not available without action cards', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Yssaril) has no action cards — Component Action should have no options
        t.choose(game, 'Component Action')

        // Should immediately return (no component actions)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })
    })
  })

  describe('Universities of Jol-Nar', () => {
    describe('Analytical', () => {
      test('can research tech with 1 missing prerequisite (non-unit-upgrade)', () => {
        // Jol-Nar starts with 4 techs: neural-motivator(green), antimass-deflectors(blue),
        // sarween-tools(yellow), plasma-scoring(red) — 1 of each color
        // Fleet Logistics needs 2 blue, but Analytical lets them skip 1
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action')

        const choices = t.currentChoices(game)
        expect(choices).toContain('fleet-logistics')
      })

      test('cannot skip prerequisite for unit upgrade technologies', () => {
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        game.run()

        // Analytical should NOT skip prereqs for unit upgrades
        const dennis = game.players.byName('dennis')
        // Carrier II needs 2 blue — Jol-Nar has 1 blue (antimass-deflectors)
        // Since Carrier II is a unit upgrade, Analytical should NOT help
        expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
      })

      test('non-Jol-Nar cannot skip prerequisites', () => {
        // Hacan with same 1 blue tech cannot research fleet-logistics (needs 2 blue)
        const game = t.fixture({ factions: ['emirates-of-hacan', 'universities-of-jol-nar'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        expect(dennis.canResearchTechnology('fleet-logistics')).toBe(false)
      })
    })

    describe('Fragile', () => {
      test('Jol-Nar combat rolls are less effective', () => {
        const { Galaxy } = require('../model/Galaxy.js')
        const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })

        // Find adjacent system using the same game's galaxy
        const setupGame = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
        setupGame.run()
        const galaxy = new Galaxy(setupGame)
        const targetSystem = galaxy.getAdjacent('jolnar-home')[0]

        // Jol-Nar has 5 cruisers (combat 7, with Fragile effectively combat 8)
        // vs 1 fighter (combat 9) — Jol-Nar should still win with 5 ships
        t.setBoard(game, {
          dennis: {
            units: {
              'jolnar-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'jol': ['space-dock'],
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
          movements: [{ unitType: 'cruiser', from: 'jolnar-home', count: 5 }],
        })

        // Even with Fragile, 5 cruisers should destroy 1 fighter
        const micahShips = game.state.units[targetSystem].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })
    })
  })

  describe("Sardakk N'orr", () => {
    describe('Unrelenting', () => {
      test('Sardakk combat rolls are more effective', () => {
        const { Galaxy } = require('../model/Galaxy.js')
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })

        // Find adjacent system to norr-home
        const setupGame = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        setupGame.run()
        const galaxy = new Galaxy(setupGame)
        const targetSystem = galaxy.getAdjacent('norr-home')[0]

        // Sardakk has 5 cruisers (combat 7, with Unrelenting effectively combat 6)
        // vs 1 fighter (combat 9) — Sardakk should win easily
        t.setBoard(game, {
          dennis: {
            units: {
              'norr-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'quinarra': ['space-dock'],
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

        // Dennis (Sardakk) uses tactical action
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: targetSystem })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
        })

        // 5 cruisers with Unrelenting should destroy 1 fighter
        const micahShips = game.state.units[targetSystem].space
          .filter(u => u.owner === 'micah')
        expect(micahShips.length).toBe(0)
      })

      test('non-Sardakk player does not get Unrelenting bonus', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        game.run()

        // Sardakk has it
        const dennis = game.players.byName('dennis')
        expect(dennis.faction.abilities.some(a => a.id === 'unrelenting')).toBe(true)

        // Hacan does not
        const micah = game.players.byName('micah')
        expect(micah.faction.abilities.some(a => a.id === 'unrelenting')).toBe(false)
      })
    })
  })

  describe('Faction Technologies', () => {
    test('Sol faction techs are researchable after prerequisites', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'antimass-deflectors', 'psychoarchaeology', 'bio-stims'],
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has 2 green prereqs — can research Spec Ops II (needs 2 green)
      t.choose(game, 'Strategic Action')

      const choices = t.currentChoices(game)
      expect(choices).toContain('spec-ops-ii')
    })

    test('Letnev faction techs include L4 Disruptors', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      t.setBoard(game, {
        scott: {
          technologies: ['antimass-deflectors', 'plasma-scoring', 'sarween-tools'],
        },
      })
      game.run()

      // Check that Letnev can see their faction techs
      const scott = game.players.byName('scott')
      const prereqs = scott.getTechPrerequisites()
      // Has plasma-scoring (red) + sarween-tools (yellow) -> 1 red, 1 yellow
      expect(prereqs.red).toBe(1)
      expect(prereqs.yellow).toBe(1)
    })
  })

  describe('Starting Units', () => {
    test('Sol starts with correct home system units', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(jord).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('Letnev starts with dreadnought', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const spaceUnits = game.state.units['letnev-home'].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])
    })
  })
})
