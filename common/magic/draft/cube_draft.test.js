Error.stackTraceLimit = 100

const t = require('./testutil_cube.js')


describe('CubeDraft', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

  describe('make picks', () => {

    test('dennis first pick', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')

      t.testBoard(game, {
        dennis: {
          picked: ['agility'],
          waiting: [],
        },
        micah: {
          picked: [],
          waiting: ['micah-0', 'dennis-0'],
        },
      })
    })

    test('micah first pick', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'micah', 'lightning bolt')

      t.testBoard(game, {
        dennis: {
          picked: [],
          waiting: ['dennis-0', 'micah-0'],
        },
        micah: {
          picked: ['lightning bolt'],
          waiting: [],
        },
      })
    })

    test('dennis micah dennis', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'dennis', 'mountain')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain'],
          waiting: [],
        },
        micah: {
          picked: ['lightning bolt'],
          waiting: ['dennis-0', 'micah-0'],
        },
      })
    })

    test('dennis micah micah', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')

      t.testBoard(game, {
        dennis: {
          picked: ['agility'],
          waiting: ['micah-0', 'dennis-0'],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: [],
        },
      })
    })
  })

  describe('open next packs', () => {

    test('dennis opens first', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain', 'akki ember-keeper'],
          waiting: ['dennis-1'],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: ['micah-0'],
        },
      })
    })

    test('dennis opens then picks', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')
      const request7 = t.choose(game, request6, 'dennis', 'goblin balloon brigade')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain', 'akki ember-keeper', 'goblin balloon brigade'],
          waiting: [],
          nextRound: [],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: ['micah-0'],
          nextRound: ['dennis-1'],
        },
      })
    })

    test('micah opens a new pack after dennis passes a new pack to him', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')
      const request7 = t.choose(game, request6, 'dennis', 'goblin balloon brigade')
      const request8 = t.choose(game, request7, 'micah', 'plains')
      const request9 = t.choose(game, request8, 'micah', 'shock')
      const request10 = t.choose(game, request9, 'micah', 'holy strength')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain', 'akki ember-keeper', 'goblin balloon brigade'],
          waiting: ['micah-1', 'dennis-1'],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout', 'plains', 'shock', 'holy strength'],
          waiting: [],
        },
      })
    })

    test('cannot pick from a pack passed to you until you have finished the current pack', () => {
      const game = t.fixture({ numPlayers: 3, packSize: 2 })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'micah', 'shock')

      // At this point, micah has opened his second pack and selected a card from it,
      // but dennis has only drafted one card, so he shouldn't be able to pick from the
      // pack that micah passed him.
      expect(request5.selectors.length).toBe(1)
      expect(request5.selectors[0].actor).toBe('scott')

      const request6 = t.choose(game, request5, 'scott', 'lightning bolt')

      // Now, scott passed dennis a pack, so dennis should be able to draft from this index 0 pack.
      // Scott still needs to pick his second card from the first round pack.
      expect(request6.selectors.length).toBe(2)

      const request7 = t.choose(game, request6, 'dennis', 'mountain')

      // Now, dennis has picked two cards from the first pack (of size 2), so he should be able
      // to pick a card from the pack second round pack that micah passed him.
      // Scott still needs to pick his second card from the first round pack.
      expect(request7.selectors.length).toBe(2)

      const request8 = t.choose(game, request7, 'dennis', 'benalish hero')

      // Now, dennis has picked a card from his round 2 pack, and can see micah's round 2 pack.
      // Scott still needs to pick his second card from the first round pack.
      expect(request8.selectors.length).toBe(2)
    })
  })

  describe('pack visibility', () => {
    test('can see all unpicked cards the first time seeing a pack', () => {
      const game = t.fixture({ packSize: 5 })

      const request1 = game.run()

      t.testVisibility(game, 'dennis', {
        visible: [
          'advance scout',
          'agility',
          'akki ember-keeper',
          'white knight',
          'shock',
        ],
        picked: [],
        yourPicks: [],
      })
    })

    test('cannot see cards picked before first time seeing a pack', () => {
      const game = t.fixture({ packSize: 5 })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')

      t.testVisibility(game, 'micah', {
        visible: [
          'advance scout',
          'akki ember-keeper',
          'white knight',
          'shock',
        ],
        picked: [],
        yourPicks: [],
      })
    })

    test('can see cards missing from pack since you last saw it', () => {
      const game = t.fixture({ packSize: 5 })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')

      t.testVisibility(game, 'dennis', {
        visible: [
          'agility',
          'akki ember-keeper',
          'advance scout',
          'white knight',
          'shock',
        ],
        picked: ['agility', 'advance scout'],
        yourPicks: ['agility'],
      })
    })
  })

  describe('game complete', () => {

    test('last pick', () => {
      const game = t.fixture({ numPacks: 2 })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')
      const request7 = t.choose(game, request6, 'dennis', 'goblin balloon brigade')
      const request8 = t.choose(game, request7, 'micah', 'plains')
      const request9 = t.choose(game, request8, 'micah', 'shock')
      const request10 = t.choose(game, request9, 'micah', 'holy strength')
      const request11 = t.choose(game, request10, 'dennis', 'white knight')
      const request12 = t.choose(game, request11, 'micah', 'tithe')
      const request13 = t.choose(game, request12, 'dennis', 'benalish hero')

      t.testBoard(game, {
        dennis: {
          picked: [
            'agility',
            'mountain',
            'akki ember-keeper',
            'goblin balloon brigade',
            'white knight',
            'benalish hero',
          ],
          waiting: [],
        },
        micah: {
          picked: [
            'lightning bolt',
            'advance scout',
            'plains',
            'shock',
            'holy strength',
            'tithe',
          ],
          waiting: [],
        },
      })
    })

  })
})
