const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Universities of Jol-Nar', () => {
  describe('Data', () => {
    test('starts with 4 technologies (one of each color)', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds()
      expect(techs.length).toBe(4)
      expect(techs).toContain('neural-motivator')
      expect(techs).toContain('antimass-deflectors')
      expect(techs).toContain('sarween-tools')
      expect(techs).toContain('plasma-scoring')
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('universities-of-jol-nar')
      expect(faction.factionTechnologies.length).toBe(3)

      const eRes = faction.factionTechnologies.find(t => t.id === 'e-res-siphons')
      expect(eRes.color).toBe('yellow')
      expect(eRes.prerequisites).toEqual(['yellow', 'yellow'])

      const spatial = faction.factionTechnologies.find(t => t.id === 'spatial-conduit-cylinder')
      expect(spatial.color).toBe('blue')
      expect(spatial.prerequisites).toEqual(['blue', 'blue'])

      const specialized = faction.factionTechnologies.find(t => t.id === 'specialized-compounds')
      expect(specialized.color).toBeNull()
      expect(specialized.prerequisites).toEqual(['yellow', 'green'])
    })
  })

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

  describe('Brilliant', () => {
    test('can skip 2 prerequisites total (analytical + brilliant) for non-unit-upgrade', () => {
      // Jol-Nar starts with 4 techs (1 each color)
      // Graviton Laser System needs 1 yellow + 1 red — Jol-Nar has both, so no skip needed
      // Light/Wave Deflector needs 3 blue — Jol-Nar has 1 blue, deficit 2
      // Analytical (1 skip) + Brilliant (1 skip) = 2 total skips
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      // Light/Wave Deflector needs 3 blue prereqs — Jol-Nar has 1 blue (deficit 2)
      // analytical skip 1 + brilliant skip 1 = can research
      expect(dennis.canResearchTechnology('light-wave-deflector')).toBe(true)
    })

    test('brilliant does not help unit upgrades', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      // Carrier II needs 2 blue — Jol-Nar has 1 blue (deficit 1)
      // analytical doesn't apply to unit upgrades, brilliant doesn't either
      expect(dennis.canResearchTechnology('carrier-ii')).toBe(false)
    })
  })

  describe('Fragile', () => {
    test('Jol-Nar combat rolls are less effective', () => {
      // Deterministic layout: jolnar-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })

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
        movements: [{ unitType: 'cruiser', from: 'jolnar-home', count: 5 }],
      })

      // Even with Fragile, 5 cruisers should destroy 1 fighter
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })
  })

  describe('Agent — Doctor Sucaban', () => {
    test.todo('when a player spends resources to research, may exhaust to let them remove infantry to reduce cost')
  })

  describe('Commander — Agnlan Oln', () => {
    test.todo('after rolling dice for a unit ability, may reroll any of those dice')
    test.todo('unlock condition: own 8 technologies')
  })

  describe("Hero — Rin, The Master's Legacy", () => {
    test.todo('Genetic Memory: for each non-unit upgrade tech owned, may replace with any tech of same color from deck, then purge')
  })

  describe('Mech DEPLOY — Shield Paling', () => {
    test.todo('infantry on this planet are not affected by the Fragile faction ability')
  })

  describe('Promissory Note — Research Agreement', () => {
    test.todo('after Jol-Nar researches a non-faction technology, gain that technology, then return card')
  })

  describe('Faction Technologies', () => {
    describe('E-Res Siphons', () => {
      test.todo('after another player activates a system with your ships, gain 4 trade goods')
    })

    describe('Spatial Conduit Cylinder', () => {
      test.todo('exhaust after activating a system with own units; that system is adjacent to all other systems with own units during this activation')
    })

    describe('Specialized Compounds', () => {
      test.todo('when researching via Technology strategy card, may exhaust a tech specialty planet instead of spending resources')
      test.todo('must research a technology of the specialty color when using this ability')
    })
  })
})
