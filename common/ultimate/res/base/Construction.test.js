Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Construction', () => {
  describe(`I demand you transfer two cards from your hand to my hand! Draw a {2}!`, () => {
    test('choose two cards', () => {
      const game = t.fixtureFirstPlayer()
      const handNames = ['Experimentation', 'Gunpowder', 'Statistics']
      t.setBoard(game, {
        dennis: {
          red: ['Construction'],
        },
        micah: {
          hand: handNames,
        },
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Construction')

      const selector = request.selectors[0]
      expect(selector.actor).toBe('micah')
      expect(selector.count).toBe(2)
      expect(selector.choices.sort()).toEqual(handNames)
    })

    test('draw a 2', () => {
      const game = t.fixtureFirstPlayer()
      const handNames = ['Experimentation', 'Gunpowder', 'Statistics']
      t.setBoard(game, {
        dennis: {
          red: ['Construction'],
        },
        micah: {
          hand: handNames,
        },
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Construction')
      request = t.choose(game, request, 'Experimentation', 'Statistics')
      request = t.choose(game, request, 'auto')

      const micah = game.players.byName('micah')
      const micahHandAges = game.zones.byPlayer(micah, 'hand').cardlist().map(c => c.age).sort()
      expect(micahHandAges).toEqual([2, 4])
    })
  })

  describe(`If you are the only player with five top cards, claim the Empire achievement.`, () => {
    test('claim empire achievement', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          red: ['Construction'],
          green: ['Mapmaking'],
          yellow: ['Fermenting'],
          blue: ['Mathematics'],
          purple: ['Monotheism'],
        },
      })
      let request
      request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.players.byName('dennis')
      const dennisAchievements = game.zones.byPlayer(dennis, 'achievements').cardlist().map(c => c.name)
      expect(dennisAchievements).toEqual(['Empire'])
    })

    test('someone else has 5 top cards', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          red: ['Construction'],
          yellow: ['Fermenting'],
          green: ['Mapmaking'],
          blue: ['Mathematics'],
          purple: ['Monotheism'],
        },
        micah: {
          // Choosing cards from age 4 ensures no castles, so no sharing.
          red: ['Gunpowder'],
          yellow: ['Anatomy'],
          green: ['Navigation'],
          blue: ['Experimentation'],
          purple: ['Reformation'],
        },
      })

      let request
      request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.players.byName('dennis')
      const dennisAchievements = game.zones.byPlayer(dennis, 'achievements').cardlist().map(c => c.name)
      expect(dennisAchievements).toEqual([])
    })

    test('do not have 5 top cards', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          red: ['Construction'],
          green: ['Mapmaking'],
          yellow: ['Fermenting'],
          blue: ['Mathematics'],
          // purple: ['Monotheism'],
        },
      })
      let request
      request = game.run()
      t.choose(game, request, 'Dogma.Construction')

      const dennis = game.players.byName('dennis')
      const dennisAchievements = game.zones.byPlayer(dennis, 'achievements').cardlist().map(c => c.name)
      expect(dennisAchievements).toEqual([])
    })
  })
})
