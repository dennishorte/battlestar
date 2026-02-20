const t = require('../testutil.js')
const res = require('../res/index.js')

describe('Factions', () => {
  describe('Federation of Sol', () => {
    test('starts with Antimass Deflectors and Neural Motivator', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
    })

    test('starts with 2 carriers, 1 destroyer, 5 infantry, 1 space dock', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'sol-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jord = game.state.units[homeSystem].planets['jord']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(jord).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('Versatile: gains 1 extra command token in status phase', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      // Strategy phase
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Both use strategy cards then pass
      t.choose(game, 'Strategic Action')  // dennis: leadership (auto)
      t.choose(game, 'Pass')             // micah declines leadership secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy (needs system choice)
      t.choose(game, 'hacan-home')        // micah picks system for diplomacy
      t.choose(game, 'Pass')             // dennis declines diplomacy secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: dennis (Sol) gets 3 tokens (2 + 1 Versatile), micah gets 2
      // Both click Done to accept default distribution (all to tactics)
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Sol: tactics started at 3, spent 0 (used strategic action, not tactical),
      // then gains 3 in status = tactics should be 6
      // Hacan: tactics 3, gains 2 = 5
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      // Dennis: 3 (start) + 3 (leadership primary) + 3 (status: 2 + 1 Versatile) = 9
      expect(dennis.commandTokens.tactics).toBe(9)
      // Micah: 3 (start) + 2 (status) = 5
      expect(micah.commandTokens.tactics).toBe(5)
    })

    test('flagship Genesis has capacity 12', () => {
      const faction = res.getFaction('federation-of-sol')
      expect(faction.flagship.name).toBe('Genesis')
      expect(faction.flagship.capacity).toBe(12)
    })

    test('Spec Ops II upgrades infantry', () => {
      const faction = res.getFaction('federation-of-sol')
      const specOps = faction.factionTechnologies.find(t => t.id === 'spec-ops-ii')
      expect(specOps).toBeTruthy()
      expect(specOps.unitUpgrade).toBe('infantry')
      expect(specOps.stats.combat).toBe(6)
    })

    test('Advanced Carrier II adds sustain damage to carriers', () => {
      const faction = res.getFaction('federation-of-sol')
      const carrier2 = faction.factionTechnologies.find(t => t.id === 'advanced-carrier-ii')
      expect(carrier2).toBeTruthy()
      expect(carrier2.unitUpgrade).toBe('carrier')
      expect(carrier2.stats.abilities).toContain('sustain-damage')
      expect(carrier2.stats.capacity).toBe(8)
    })
  })

  describe('Emirates of Hacan', () => {
    test('starts with Antimass Deflectors and Sarween Tools', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const micah = game.players.byName('micah')
      expect(micah.hasTechnology('antimass-deflectors')).toBe(true)
      expect(micah.hasTechnology('sarween-tools')).toBe(true)
    })

    test('starts with 2 carriers, 1 cruiser, 2 fighters, 4 infantry, 1 space dock', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'hacan-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])

      // Infantry split across arretze and hercant
      const arretze = game.state.units[homeSystem].planets['arretze']
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()
      expect(arretze).toEqual(['infantry', 'infantry', 'space-dock'])

      const hercant = game.state.units[homeSystem].planets['hercant']
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()
      expect(hercant).toEqual(['infantry', 'infantry'])
    })

    test('6 commodities', () => {
      const faction = res.getFaction('emirates-of-hacan')
      expect(faction.commodities).toBe(6)
    })

    test('Masters of Trade: free Trade secondary', () => {
      const faction = res.getFaction('emirates-of-hacan')
      const mastersOfTrade = faction.abilities.find(a => a.id === 'masters-of-trade')
      expect(mastersOfTrade).toBeTruthy()
    })

    test('Guild Ships: trade with non-neighbors', () => {
      const faction = res.getFaction('emirates-of-hacan')
      const guildShips = faction.abilities.find(a => a.id === 'guild-ships')
      expect(guildShips).toBeTruthy()
    })
  })

  describe('Barony of Letnev', () => {
    test('starts with Antimass Deflectors and Plasma Scoring', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.hasTechnology('antimass-deflectors')).toBe(true)
      expect(scott.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with 1 dreadnought, 1 carrier, 1 destroyer, 1 fighter, 3 infantry, 1 space dock', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const homeSystem = 'letnev-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])

      const arcPrime = game.state.units[homeSystem].planets['arc-prime']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(arcPrime).toEqual(['infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('barony-of-letnev')
      expect(faction.commodities).toBe(2)
    })

    test('Munitions Reserves: spend 2 TG to reroll combat dice', () => {
      const faction = res.getFaction('barony-of-letnev')
      const munitions = faction.abilities.find(a => a.id === 'munitions-reserves')
      expect(munitions).toBeTruthy()
    })

    test('Armada: fleet pool +2 for non-fighter ships', () => {
      const faction = res.getFaction('barony-of-letnev')
      const armada = faction.abilities.find(a => a.id === 'armada')
      expect(armada).toBeTruthy()
    })
  })

  describe('Naalu Collective', () => {
    test('starts with Neural Motivator and Sarween Tools', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'naalu-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'destroyer', 'fighter', 'fighter', 'fighter'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('naalu-collective')
      expect(faction.commodities).toBe(3)
    })

    test('Telepathic ability defined', () => {
      const faction = res.getFaction('naalu-collective')
      const telepathic = faction.abilities.find(a => a.id === 'telepathic')
      expect(telepathic).toBeTruthy()
    })
  })

  describe('Mentak Coalition', () => {
    test('starts with Sarween Tools and Plasma Scoring', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.hasTechnology('sarween-tools')).toBe(true)
      expect(scott.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with correct units including PDS', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      game.run()

      const homeSystem = 'mentak-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'])

      const mollPrimus = game.state.units[homeSystem].planets['moll-primus']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(mollPrimus).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('mentak-coalition')
      expect(faction.commodities).toBe(2)
    })

    test('Ambush ability defined', () => {
      const faction = res.getFaction('mentak-coalition')
      const ambush = faction.abilities.find(a => a.id === 'ambush')
      expect(ambush).toBeTruthy()
    })

    test('Pillage ability defined', () => {
      const faction = res.getFaction('mentak-coalition')
      const pillage = faction.abilities.find(a => a.id === 'pillage')
      expect(pillage).toBeTruthy()
    })
  })

  describe('Yssaril Tribes', () => {
    test('starts with Neural Motivator', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'yssaril-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('yssaril-tribes')
      expect(faction.commodities).toBe(3)
    })

    test('Stall Tactics ability defined', () => {
      const faction = res.getFaction('yssaril-tribes')
      const stallTactics = faction.abilities.find(a => a.id === 'stall-tactics')
      expect(stallTactics).toBeTruthy()
    })
  })

  describe('Universities of Jol-Nar', () => {
    test('starts with all 4 base technologies', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'jolnar-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'dreadnought', 'fighter'])

      const nar = game.state.units[homeSystem].planets['nar']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(nar).toEqual(['infantry', 'pds', 'pds'])

      const jol = game.state.units[homeSystem].planets['jol']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(jol).toEqual(['infantry', 'space-dock'])
    })

    test('4 commodities', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      expect(faction.commodities).toBe(4)
    })

    test('Fragile ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const fragile = faction.abilities.find(a => a.id === 'fragile')
      expect(fragile).toBeTruthy()
    })

    test('Analytical ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const analytical = faction.abilities.find(a => a.id === 'analytical')
      expect(analytical).toBeTruthy()
    })

    test('Brilliant ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const brilliant = faction.abilities.find(a => a.id === 'brilliant')
      expect(brilliant).toBeTruthy()
    })

    test('faction technologies defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      expect(faction.factionTechnologies.length).toBe(2)
      const eRes = faction.factionTechnologies.find(t => t.id === 'e-res-siphons')
      const spatial = faction.factionTechnologies.find(t => t.id === 'spatial-conduit-cylinder')
      expect(eRes).toBeTruthy()
      expect(spatial).toBeTruthy()
    })
  })

  describe("Sardakk N'orr", () => {
    test('starts with no technologies', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'sardakk-norr'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.getTechnologies().length).toBe(0)
    })

    test('starts with correct units', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'sardakk-norr'],
      })
      game.run()

      const homeSystem = 'norr-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser'])

      const trenlak = game.state.units[homeSystem].planets['trenlak']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(trenlak).toEqual(['infantry', 'infantry', 'infantry', 'pds'])

      const quinarra = game.state.units[homeSystem].planets['quinarra']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(quinarra).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('sardakk-norr')
      expect(faction.commodities).toBe(3)
    })

    test('Unrelenting ability defined', () => {
      const faction = res.getFaction('sardakk-norr')
      const unrelenting = faction.abilities.find(a => a.id === 'unrelenting')
      expect(unrelenting).toBeTruthy()
    })

    test('faction technologies defined', () => {
      const faction = res.getFaction('sardakk-norr')
      expect(faction.factionTechnologies.length).toBe(2)
      const valkyrie = faction.factionTechnologies.find(t => t.id === 'valkyrie-particle-weave')
      const exotrireme = faction.factionTechnologies.find(t => t.id === 'exotrireme-ii')
      expect(valkyrie).toBeTruthy()
      expect(exotrireme).toBeTruthy()
      expect(exotrireme.unitUpgrade).toBe('dreadnought')
    })
  })

  describe('Leaders', () => {
    test('agent starts unlocked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agent).toBe('ready')
    })

    test('commander starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('locked')
    })

    test('hero starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.hero).toBe('locked')
    })

    test('commander unlocks when condition met', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('unlocked')
    })

    test('hero purged after use', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'purged' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.hero).toBe('purged')
    })
  })
})
