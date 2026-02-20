const t = require('../testutil.js')

describe('Technology', () => {
  describe('Prerequisites', () => {
    test('can research tech with no prerequisites', () => {
      const game = t.fixture()
      game.run()

      // Sol starts with neural-motivator (green) + antimass-deflectors (blue)
      const dennis = game.players.byName('dennis')
      // Sarween Tools has no prerequisites
      expect(dennis.canResearchTechnology('sarween-tools')).toBe(true)
    })

    test('color prerequisites checked correctly', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // Sol has 1 green (neural-motivator) + 1 blue (antimass-deflectors)
      // Gravity Drive needs 1 blue — should be researchable
      expect(dennis.canResearchTechnology('gravity-drive')).toBe(true)
      // Dacxive Animators needs 1 green — should be researchable
      expect(dennis.canResearchTechnology('dacxive-animators')).toBe(true)
      // Fleet Logistics needs 2 blue — only have 1 blue
      expect(dennis.canResearchTechnology('fleet-logistics')).toBe(false)
    })

    test('cannot research already-owned tech', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      // Sol already has neural-motivator
      expect(dennis.canResearchTechnology('neural-motivator')).toBe(false)
    })

    test('researched tech counts toward prerequisites', () => {
      const game = t.fixture()
      // Give dennis an extra blue tech so he can research fleet-logistics (needs 2 blue)
      t.setBoard(game, {
        dennis: {
          technologies: ['antimass-deflectors', 'neural-motivator', 'gravity-drive'],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // Now has 2 blue (antimass + gravity-drive) — can research fleet-logistics
      expect(dennis.canResearchTechnology('fleet-logistics')).toBe(true)
    })
  })

  describe('Tech Prerequisite Counting', () => {
    test('getTechPrerequisites counts owned tech colors', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const prereqs = dennis.getTechPrerequisites()
      expect(prereqs.green).toBe(1)   // neural-motivator
      expect(prereqs.blue).toBe(1)    // antimass-deflectors
      expect(prereqs.red).toBe(0)
      expect(prereqs.yellow).toBe(0)
    })
  })

  describe('Technology List', () => {
    test('player starts with faction technologies', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const techs = dennis.getTechnologies().map(id => id.replace('dennis-', ''))
      expect(techs).toContain('neural-motivator')
      expect(techs).toContain('antimass-deflectors')
    })

    test('hasTechnology checks owned techs', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(false)
    })
  })
})
