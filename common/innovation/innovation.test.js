Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('./game.js')

const t = require('./testutil.js')

describe('fixture', () => {
  test('player hands are set as expected', () => {
    const game = t.fixture()
    game.run()

    const dennis = game
      .getZoneByPlayer(game.getPlayerByName('dennis'), 'hand')
      .cards()
      .map(c => c.name)
      .sort()
    expect(dennis).toStrictEqual(['Archery', 'Domestication'])

    const micah = game
      .getZoneByPlayer(game.getPlayerByName('micah'), 'hand')
      .cards()
      .map(c => c.name)
      .sort()
    expect(micah).toStrictEqual(['Code of Laws', 'Mysticism'])
  })

  test('setColor', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Gunpowder', 'Industrialization'])
    })
    game.run()
    const dennis = game.getPlayerByName('dennis')

    const redCardNames = game.getZoneByPlayer(dennis, 'red').cards().map(c => c.name).sort()
    expect(redCardNames).toStrictEqual(['Gunpowder', 'Industrialization'])
  })
})

describe('Innovation', () => {
  test('game initializes', () => {
    const game = t.fixture()
    game.run()
  })

  describe('first picks', () => {
    test('all players can pick at once', () => {
      const game = t.fixture()
      const result = game.run()

      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.selectors.length).toBe(2)
      expect(result.selectors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          actor: 'dennis',
          title: 'Choose First Card',
        }),
        expect.objectContaining({
          actor: 'micah',
          title: 'Choose First Card',
        }),
      ]))
    })

    test('after picking, selected cards are played', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
        key: request1.key
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Archery'],
        key: request1.key
      })

      const dennisRed = game
        .getZoneByPlayer(game.getPlayerByName('dennis'), 'red')
        .cards()
        .map(c => c.name)
      expect(dennisRed).toStrictEqual(['Archery'])

      const micahPurple = game
        .getZoneByPlayer(game.getPlayerByName('micah'), 'purple')
        .cards()
        .map(c => c.name)
      expect(micahPurple).toStrictEqual(['Code of Laws'])
    })

    test('player closest to start of alphabet goes first (test a)', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
        key: request1.key
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Archery'],
        key: request1.key
      })

      expect(game.getPlayerCurrent().name).toBe('dennis')
    })

    test('player closest to start of alphabet goes first (test b)', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
        key: request1.key
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Domestication'],
        key: request1.key
      })

      expect(game.getPlayerCurrent().name).toBe('micah')
    })
  })

  describe('triggers', () => {
    test('unsplay colors with one or fewer cards', () => {
      const game = t.fixtureTopCard('Globalization')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
        t.setSplay(game, 'dennis', 'yellow', 'up')
        t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
        t.setSplay(game, 'micah', 'yellow', 'left')
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Globalization')

      expect(t.zone(game, 'yellow', 'micah').splay).toBe('none')
    })
  })

  describe('achievement victory', () => {
    test('check after each step of each action', () => {

    })

    test('list of player achievements includes special ones', () => {

    })
  })

  describe('figures fade at end of each action', () => {
    test('choose and fade, repeatedly', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Alexander the Great'])
        t.setColor(game, 'dennis', 'purple', ['Alfred Nobel', 'Adam Smith'])
        t.setColor(game, 'dennis', 'yellow', ['Shennong', 'Alex Trebek'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Draw.draw a card')
      const request3 = t.choose(game, request2, 'Shennong')
      const request4 = t.choose(game, request3, 'Alexander the Great')
      const request5 = t.choose(game, request4, 'Alex Trebek')

      t.testIsSecondPlayer(request5)
    })
  })

  describe('cities', () => {
    test.skip('plus icon', () => {

    })

    test.skip('flag but not most', () => {

    })

    test.skip('flag and most', () => {

    })

    test.skip('fountain', () => {

    })

    test.skip('splay left', () => {

    })

    test.skip('splay right', () => {

    })

    test.skip('splay up', () => {

    })

    test.skip('draw for biscuit', () => {

    })
  })

  describe('karma', () => {
    test.skip('multiple if/then karmas, only choose one', () => {

    })

    test.skip('karmas do not trigger karmas', () => {

    })
  })

  describe('actions', () => {
    describe('first player gets only one action', () => {
      test.skip('two players', () => {

      })

      test.skip('three players', () => {

      })

      test.skip('four players', () => {

      })
    })

    describe('achieve action', () => {
      test('do not need to achieve in order', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAvailableAchievements(game, ['Writing', 'Mathematics', 'Machinery', 'Reformation'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 1', 'age 2', 'age 3'])
      })

      test('duplicate achievements are deduped', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAvailableAchievements(game, ['Writing', 'The Wheel', 'Construction', 'Mathematics', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 1', 'age 2', 'age 3'])
      })

      test('cost for second of same age is double (part 1)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal', 'Enterprise']) // 19
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['Monotheism'])
          t.setAvailableAchievements(game, ['Construction', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 3'])
      })

      test('cost for second of same age is double (part 2)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal', 'Statistics']) // 20
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['Monotheism'])
          t.setAvailableAchievements(game, ['Construction', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 2', 'age 3'])
      })

      test('cost for third of same age is triple (part 1)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Enterprise']) // 14
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['The Wheel', 'Code of Laws'])
          t.setAvailableAchievements(game, ['Mysticism'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual([])
      })

      test('cost for third of same age is triple (part 2)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Statistics']) // 15
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['The Wheel', 'Code of Laws'])
          t.setAvailableAchievements(game, ['Mysticism'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 1'])
      })

      test('age restriction', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['Writing', 'Mathematics', 'Machinery', 'Reformation'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['age 1', 'age 2'])
      })

      test('achieved cards are moved to achievements', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.age 2')

        expect(t.cards(game, 'achievements')).toStrictEqual(['Monotheism'])
      })

      test('in figures, opponents get a figure', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])

          t.setDeckTop(game, 'figs', 1, ['Imhotep'])
          t.setHand(game, 'micah', [])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.age 2')

        expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Imhotep'])
      })

      test('in figures, opponents do not get a figure for non-standard', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])

          t.setDeckTop(game, 'figs', 1, ['Imhotep'])
          t.setHand(game, 'micah', [])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.age 2')

        expect(t.cards(game, 'hand', 'micah')).toStrictEqual([])
      })

      test('can achieve cards made available by karma', () => {
        const game = t.fixtureTopCard('Amina Sukhera', { expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setAvailableAchievements(game, ['Code of Laws'])
          t.setColor(game, 'dennis', 'green', ['The Wheel'])
          t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
          t.setScore(game, 'dennis', ['Statistics'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.The Wheel')

        t.testZone(game, 'achievements', ['The Wheel'])
      })
    })

    describe('decree action', () => {
      test('from three figure cards', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Ptolemy', 'Al-Kindi'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([
          'Rivalry',
          'Trade',
        ])
      })

      test('from three figure cards (same age does not work)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Sinuhe', 'Ptolemy'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([])
      })

      test('all colors work', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Ptolemy', 'Yi Sun-Sin', 'Daedalus', 'Shennong'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([
          'Advancement',
          'Expansion',
          'Rivalry',
          'Trade',
          'War',
        ])
      })

      test('from two figures and a karma (same age)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Sinuhe'])
          t.setHand(game, 'dennis', ['Homer', 'Fu Xi'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual(['Rivalry'])
      })

      test('karma for two figures, but only one in hand', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Sinuhe'])
          t.setHand(game, 'dennis', ['Homer', 'Mathematics'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([])
      })

      test('first claim', () => {

      })

      test('already have', () => {

      })

      test('opponent has', () => {

      })
    })

    describe('dogma action', () => {
      test('echo', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'red', ['Metalworking', 'Bangle'])
          t.setSplay(game, 'dennis', 'red', 'up')
          t.setHand(game, 'dennis', ['Archery'])
          t.setDeckTop(game, 'echo', 1, ['Ruler'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Dogma.Metalworking')

        expect(t.cards(game, 'red')).toStrictEqual(['Metalworking', 'Bangle', 'Archery'])
      })

      test('share', () => {
        const game = t.fixtureTopCard('Writing')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'red', [])
          t.setColor(game, 'micah', 'blue', ['Tools'])
        })
        const request = game.run()
        t.choose(game, request, 'Dogma.Writing')

        const dennis = game.getPlayerByName('dennis')
        const dennisHandAges = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
        expect(dennisHandAges).toStrictEqual([1, 2])

        const micah = game.getPlayerByName('micah')
        const micahHandAges = game.getZoneByPlayer(micah, 'hand').cards().map(c => c.age).sort()
        expect(micahHandAges).toStrictEqual([2])
      })

      test('no share', () => {
        const game = t.fixtureTopCard('Writing')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.clearBoard(game, 'dennis')
          t.clearBoard(game, 'micah')
          t.setColor(game, 'dennis', 'blue', ['Writing'])
        })
        const request = game.run()
        t.choose(game, request, 'Dogma.Writing')

        const dennis = game.getPlayerByName('dennis')
        const dennisHandAges = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
        expect(dennisHandAges).toStrictEqual([2])

        const micah = game.getPlayerByName('micah')
        const micahHandAges = game.getZoneByPlayer(micah, 'hand').cards().map(c => c.age).sort()
        expect(micahHandAges).toStrictEqual([])
      })

      test('demand', () => {
        // See tests for Construction to see a successful demand.
      })

      test('no share bonus on demand', () => {
        const game = t.fixtureTopCard('Archery')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.clearHand(game, 'dennis')
          t.setHand(game, 'micah', ['Gunpowder'])
          t.setDeckTop(game, 'base', 1, ['Tools'])
        })
        const result1 = game.run()
        const result2 = t.choose(game, result1, 'Dogma.Archery')

        expect(t.cards(game, 'hand')).toStrictEqual(['Gunpowder'])
        expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Tools'])
      })

      test.skip('compel', () => {

      })

      test.skip('biscuits change during dogma does not affect effects', () => {

      })
    })

    describe('draw action', () => {
      test('player draws a card based on top card age (test 1)', () => {
        const game = t.fixtureFirstPlayer()
        const request = game.run()
        const dennis = game.getPlayerByName('dennis')

        expect(game.getZoneByPlayer(dennis, 'hand').cards().length).toBe(0)

        t.choose(game, request, 'Draw.draw a card')

        const dennisCards = game.getZoneByPlayer(dennis, 'hand').cards()
        expect(dennisCards.length).toBe(1)
        expect(dennisCards.map(c => c.age).sort()).toStrictEqual([1])
      })

      test('player draws a card based on top card age (test 2)', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Specialization'])
        })

        const request = game.run()
        const dennis = game.getPlayerByName('dennis')

        t.choose(game, request, 'Draw.draw a card')

        const dennisCards = game.getZoneByPlayer(dennis, 'hand').cards()
        expect(dennisCards.length).toBe(1)
        expect(dennisCards.map(c => c.age).sort()).toStrictEqual([9])
      })

      test('draw an 11 ends the game', () => {
        const game = t.fixtureFirstPlayer()
        game.run()
        const trigger = () => {
          game.mDraw(game.getPlayerByName('dennis'), 'base', 11)
        }
        expect(trigger).toThrow(GameOverEvent)
      })
    })
  })

  describe('endorse action', () => {
    test('need a card of equal or lower age to tuck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'red', ['Tikal'])
        t.setHand(game, 'dennis', ['Cordoba'])
      })
      const result1 = game.run()
      expect(t.getChoices(result1, 'Endorse')).toStrictEqual([])
    })

    test('can choose which card to tuck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'red', ['Tikal'])
        t.setHand(game, 'dennis', ['Mathematics', 'Tools', 'Cordoba'])
      })
      const result1 = game.run()
      const result2 = t.choose(game, result1, 'Endorse.green')

      expect(result2.selectors[0].choices).toStrictEqual(['Mathematics', 'Tools'])
    })

    test('leader goes twice, shares once, demands twice', () => {
      const game = t.fixtureTopCard('Mapmaking', { numPlayers: 3 })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Barcelona'])
        t.setColor(game, 'scott', 'green', ['Venice'])
        t.setColor(game, 'scott', 'purple', ['Ephesus'])

        t.clearBoard(game, 'micah')

        t.setScore(game, 'micah', ['The Wheel', 'Clothing'])
        t.setScore(game, 'scott', [])

        t.setDeckTop(game, 'base', 1, ['Mysticism', 'Tools', 'Code of Laws'])

        t.setHand(game, 'dennis', ['Masonry'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Endorse.green')
      const request3 = t.choose(game, request2, 'Clothing') // Micah's choice

      expect(t.cards(game, 'score').sort()).toStrictEqual([
        'Clothing',
        'Code of Laws',
        'The Wheel',
        'Tools',
      ])
      expect(t.cards(game, 'score', 'scott').sort()).toStrictEqual(['Mysticism'])
    })

    test('city biscuits must match featured biscuit', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'blue', ['Cordoba'])
        t.setHand(game, 'dennis', ['Mathematics', 'Tools'])
      })
      const result1 = game.run()
      expect(t.getChoices(result1, 'Endorse')).toStrictEqual([])
    })
  })

  describe('inspire action', () => {
    test('inspire with top card', () => {
      const game = t.fixtureTopCard('Homer', { expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setDeckTop(game, 'base', 2, ['Mathematics'])
        t.setDeckTop(game, 'base', 1, ['Domestication'])
        t.setHand(game, 'dennis', [])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Inspire.purple')

      expect(t.cards(game, 'blue')).toStrictEqual(['Mathematics'])
      expect(t.cards(game, 'hand')).toStrictEqual(['Domestication'])
    })

    test('inspire with splayed card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'purple', ['Enterprise', 'Homer'])
        t.setSplay(game, 'dennis', 'purple', 'up')
        t.setDeckTop(game, 'base', 2, ['Mathematics'])
        t.setDeckTop(game, 'base', 4, ['Navigation'])
        t.setHand(game, 'dennis', [])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Inspire.purple')

      expect(t.cards(game, 'blue')).toStrictEqual(['Mathematics'])
      expect(t.cards(game, 'hand')).toStrictEqual(['Navigation'])
    })

    test('multiple inspire effects (ordering 1)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'purple', ['Plato', 'Homer'])
        t.setSplay(game, 'dennis', 'purple', 'up')
        t.setColor(game, 'dennis', 'blue', ['Tools'])
        t.setDeckTop(game, 'base', 2, ['Mathematics', 'Monotheism'])
        t.setHand(game, 'dennis', [])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Inspire.purple')
      const request3 = t.choose(game, request2, 'blue')

      // First, Homer should tuck a blue
      expect(t.cards(game, 'blue')).toStrictEqual(['Tools', 'Mathematics'])

      // Allowing Plato to splay left
      expect(t.zone(game, 'blue').splay).toBe('left')

      expect(t.cards(game, 'hand')).toStrictEqual(['Monotheism'])
    })

    test('multiple inspire effects (ordering 2)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'purple', ['Homer', 'Plato'])
        t.setSplay(game, 'dennis', 'purple', 'up')
        t.setColor(game, 'dennis', 'blue', ['Tools'])
        t.setDeckTop(game, 'base', 2, ['Mathematics', 'Monotheism'])
        t.setHand(game, 'dennis', [])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Inspire.purple')

      // First, Plato will ask to splay Purple
      expect(request2.selectors[0].choices).toStrictEqual(['purple'])
      expect(t.cards(game, 'blue')).toStrictEqual(['Tools'])

      // Then, Homer will tuck Mathematics
      const request3 = t.choose(game, request2)
      expect(t.cards(game, 'blue')).toStrictEqual(['Tools', 'Mathematics'])
    })

    test('draw based on top card of stack (test 1)', () => {
      // See test 'inspire with top card'
    })

    test('draw based on top card of stack (test 2)', () => {
      // See test 'inspire with splayed card'
    })

    test.skip('inspire does not share', () => {
    })
  })

  describe('meld action', () => {
    test('card goes on top', () => {

    })

    test('forecast', () => {

    })

    describe.skip('cities', () => {
      test('draw a city for first card of color', () => {

      })

      test('plus icon', () => {

      })

      test('splay left icon', () => {

      })

      test('splay right icon', () => {

      })

      test('splay up icon', () => {

      })

      test('biscuit', () => {

      })
    })

    describe.skip('artifacts', () => {
      test('hex position matching', () => {

      })

      test('same age', () => {

      })

      test('lower age', () => {

      })

      test('higher age (no trigger)', () => {

      })
    })
  })

  describe.skip('logs', () => {
    test('card not visible', () => {
      const game = t.fixtureFirstPlayer()
      const request = game.run()
      t.choose(game, request, 'Draw.draw a card')
      //t.dumpLog(game)
    })
  })
})
