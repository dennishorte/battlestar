const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naaz-Rokha Alliance', () => {
  describe('Data', () => {
    test('starting technologies are Psychoarchaeology and AI Development Algorithm', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechIds().sort()
      expect(techs).toEqual(['ai-development-algorithm', 'psychoarchaeology'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('naaz-rokha-alliance')
      expect(faction.factionTechnologies.length).toBe(3)

      const supercharge = faction.factionTechnologies.find(t => t.id === 'supercharge')
      expect(supercharge.name).toBe('Supercharge')
      expect(supercharge.color).toBe('red')
      expect(supercharge.prerequisites).toEqual(['red'])
      expect(supercharge.unitUpgrade).toBeNull()

      const prefab = faction.factionTechnologies.find(t => t.id === 'pre-fab-arcologies')
      expect(prefab.name).toBe('Pre-Fab Arcologies')
      expect(prefab.color).toBe('green')
      expect(prefab.prerequisites).toEqual(['green', 'green', 'green'])
      expect(prefab.unitUpgrade).toBeNull()

      const synergy = faction.factionTechnologies.find(t => t.id === 'absolute-synergy')
      expect(synergy.name).toBe('Absolute Synergy')
      expect(synergy.color).toBeNull()
      expect(synergy.prerequisites).toEqual(['green', 'blue'])
      expect(synergy.unitUpgrade).toBeNull()
    })
  })

  describe('Distant Suns', () => {
    test.todo('draw 1 additional exploration card when exploring a planet with a mech')
    test.todo('choose 1 card to resolve and discard the rest')
    test.todo('no bonus draw when exploring without a mech')
  })

  describe('Fabrication', () => {
    test('purges fragments for command token', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { relicFragments: ['cultural', 'hazardous'] },
      })
      game.run()

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Fabrication
      t.choose(game, 'Component Action')
      t.choose(game, 'fabrication')

      // "Purge 1 fragment for command token" auto-responds (only option since no pair)
      // Then choose which fragment type to purge
      t.choose(game, 'cultural')

      const dennis = game.players.byName('dennis')
      expect(dennis.relicFragments.length).toBe(1)
      expect(dennis.relicFragments[0]).toBe('hazardous')
      // Gained 1 command token (started with 3)
      expect(dennis.commandTokens.tactics).toBe(4)
    })

    test.todo('purges 2 fragments of same type for a relic')
    test.todo('offers choice when both options are available')
  })

  describe('Agent — Garv and Gunn', () => {
    test.todo('exhaust at end of any player turn to allow that player to explore 1 planet')
    test.todo('exhausted agent cannot be used')
  })

  describe('Commander — Dart and Tai', () => {
    test.todo('after gaining control of a planet from another player, may explore that planet')
    test.todo('locked commander gives no bonus')
  })

  describe('Hero — Hesh and Prit', () => {
    test.todo('Perfect Synthesis: gain 1 relic and perform secondary of up to 2 readied strategy cards')
    test.todo('spend command tokens from reinforcements instead of strategy pool')
    test.todo('purge hero after use')
  })

  describe('Mech — Eidolon', () => {
    test.todo('DEPLOY: mech has sustain damage')
    test.todo('flips to Z-Grav Eidolon at start of space combat if in space area')
    test.todo('Z-Grav Eidolon counts as a ship while in space area')
    test.todo('flips back at end of space battle')
  })

  describe('Promissory Note — Black Market Forgery', () => {
    test.todo('holder can purge 2 relic fragments of same type to gain 1 relic')
    test.todo('returns to Naaz-Rokha player after use')
  })

  describe('Faction Technologies', () => {
    describe('Supercharge', () => {
      test.todo('exhaust at start of combat round to apply +1 to all combat rolls this round')
    })

    describe('Pre-Fab Arcologies', () => {
      test.todo('after exploring a planet, ready that planet')
    })

    describe('Absolute Synergy', () => {
      test.todo('when 4 mechs in same system, may return 3 to flip this card onto mech card')
    })
  })
})
