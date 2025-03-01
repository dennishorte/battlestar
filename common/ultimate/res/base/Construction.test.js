Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Construction', () => {
  describe(`I demand you transfer two cards from your hand to my hand! Draw a {2}!`, () => {
    test('choose two cards', () => {
      const game = t.fixtureTopCard('Construction')
      const handNames = ['Experimentation', 'Gunpowder', 'Statistics']
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'micah', handNames)
      })
      let request
    request = game.run()
      request = t.choose(game, request, 'Dogma.Construction')

      const selector = request.selectors[0]
      expect(selector.actor).toBe('micah')
      expect(selector.count).toBe(2)
      expect(selector.choices.sort()).toStrictEqual(handNames)
    })

    test('draw a 2', () => {
      const game = t.fixtureTopCard('Construction')
      const handNames = ['Experimentation', 'Gunpowder', 'Statistics']
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'micah', handNames)
      })
      let request
    request = game.run()
      request = t.choose(game, request, 'Dogma.Construction')
      request = t.choose(game, request, 'Experimentation', 'Statistics')
      request = t.choose(game, request, 'auto')

      const micah = game.getPlayerByName('micah')
      const micahHandAges = game.getZoneByPlayer(micah, 'hand').cards().map(c => c.age).sort()
      expect(micahHandAges).toStrictEqual([2, 4])
    })
  })

  describe(`If you are the only player with five top cards, claim the Empire achievement.`, () => {
    test('claim empire achievement', () => {
      const game = t.fixtureTopCard('Construction')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['Mapmaking'])
        t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
        t.setColor(game, 'dennis', 'blue', ['Mathematics'])
        t.setColor(game, 'dennis', 'purple', ['Monotheism'])
      })
      let request
    request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.getPlayerByName('dennis')
      const dennisAchievements = game.getZoneByPlayer(dennis, 'achievements').cards().map(c => c.name)
      expect(dennisAchievements).toStrictEqual(['Empire'])
    })

    test('someone else has 5 top cards', () => {
      const game = t.fixtureTopCard('Construction')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
        t.setColor(game, 'dennis', 'green', ['Mapmaking'])
        t.setColor(game, 'dennis', 'blue', ['Mathematics'])
        t.setColor(game, 'dennis', 'purple', ['Monotheism'])

        // Choosing cards from age 4 ensures no castles, so no sharing.
        t.setColor(game, 'micah', 'red', ['Gunpowder'])
        t.setColor(game, 'micah', 'yellow', ['Anatomy'])
        t.setColor(game, 'micah', 'green', ['Navigation'])
        t.setColor(game, 'micah', 'blue', ['Experimentation'])
        t.setColor(game, 'micah', 'purple', ['Reformation'])
      })

      let request
    request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.getPlayerByName('dennis')
      const dennisAchievements = game.getZoneByPlayer(dennis, 'achievements').cards().map(c => c.name)
      expect(dennisAchievements).toStrictEqual([])
    })

    test('do not have 5 top cards', () => {
      const game = t.fixtureTopCard('Construction')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['Mapmaking'])
        t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
        t.setColor(game, 'dennis', 'blue', ['Mathematics'])
        // t.setColor(game, 'dennis', 'purple', ['Monotheism'])
      })
      let request
    request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.getPlayerByName('dennis')
      const dennisAchievements = game.getZoneByPlayer(dennis, 'achievements').cards().map(c => c.name)
      expect(dennisAchievements).toStrictEqual([])
    })
  })
})
