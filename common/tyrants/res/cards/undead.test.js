Error.stackTraceLimit = 100

const t = require('../../testutil.js')


describe('Undead expansion', () => {
  describe('Banshee', () => {
    test('place a spy; no power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 0,
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })
    })

    test('place a spy; enemy troop but not spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'neutral', 'micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 0,
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral', 'micah'],
        },
      })
    })

    test('place a spy; enemy spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 3,
        },
        Menzoberranzan: {
          spies: ['dennis', 'micah'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })
    })
  })

  describe('Carrion Crawler', () => {
    test('power and devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Carrion Crawler', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Carrion Crawler')
      const request3 = t.choose(game, request2, 'Advocate')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: [],
          power: 3,
        },
        market: [
          'Carrion Crawler',
          'Blackguard',
          'Bounty Hunter',
          'Doppelganger',
          'Infiltrator',
          'Spellspinner',
        ],
      })
    })
  })

  describe('Conjurer', () => {
    test('place two spies', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Conjurer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Conjurer')
      const request3 = t.choose(game, request2, 'Place two spies')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')
      const request5 = t.choose(game, request4, 'Everfire')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Conjurer'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
        'Everfire': {
          spies: ['dennis'],
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Conjurer', 'House Guard'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Conjurer')
      const request3 = t.choose(game, request2, 'Return one of your spies > Recruit up to 2 cards that each cost 3 or less without paying their costs')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')
      const request5 = t.choose(game, request4, 'Advocate')
      const request6 = t.choose(game, request5, 'Blackguard')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Conjurer'],
          discard: ['Advocate', 'Blackguard'],
        },
      })
    })
  })

  describe('Cultist of Myrkul', () => {
    test('+2 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Cultist of Myrkul', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Cultist of Myrkul')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Cultist of Myrkul'],
          influence: 2,
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Cultist of Myrkul', 'House Guard', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Cultist of Myrkul')
      const request3 = t.choose(game, request2, 'Devour this card > At end of turn, promote up to 2 other cards played this turn')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')
      const request5 = t.choose(game, request4, 'Play Card.House Guard')
      const request6 = t.choose(game, request5, 'Pass')

      t.testBoard(game, {
        dennis: {
          played: [],
          innerCircle: ['House Guard', 'House Guard'],
        },
        devoured: ['Cultist of Myrkul'],
      })
    })
  })

  describe('Death Knight', () => {
    test('Supplant a troop and gain VPs', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Death Knight', 'House Guard'],
          trophyHall: [
            'micah',
            'micah',
            'micah',
            'micah',
            'micah',

            'micah',
            'micah',
            'micah',
            'micah',
          ]
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Death Knight')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Death Knight'],
          trophyHall: [
            'troop-micah',
            'troop-micah',
            'troop-micah',
            'troop-micah',
            'troop-micah',

            'troop-micah',
            'troop-micah',
            'troop-micah',
            'troop-micah',
            'neutral',
          ],
          points: 1,
        },
        'araum-ched': {
          troops: ['dennis'],
        }
      })
    })
  })

  describe('Flesh Golem', () => {
    test('+2 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Flesh Golem', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Flesh Golem')
      const request3 = t.choose(game, request2, 'yes')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: [],
          trophyHall: ['neutral'],
          power: 2,
        },
        devoured: ['Flesh Golem'],
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Ghost', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Ghost', 'House Guard'],
          influence: 3,
        },
        devoured: ['Flesh Golem'],
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ghost')
      const request3 = t.choose(game, request2, 'Place a spy; for the rest of your turn treat the top card of the devoured deck as if it was in the market')
      const request4 = t.choose(game, request3, 'Menzoberranzan')
      const request5 = t.choose(game, request4, 'Recruit.devoured: Flesh Golem')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ghost'],
          discard: ['Flesh Golem'],
          power: 0,
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })
    })

    test('Return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Ghost', 'House Guard'],
          discard: ['Priestess of Lolth'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ghost')
      const request3 = t.choose(game, request2, 'Return one of your spies > You may devour a card in your discard pile; if you do, gain the effects of the devoured card')
      const request4 = t.choose(game, request3, 'Priestess of Lolth')
      const request5 = t.choose(game, request4, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ghost'],
          discard: [],
          influence: 2,
        },
        'Chasmleap Bridge': {
          spies: []
        },
      })
    })

    /* test('Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market', () => {
     *   const game = t.gameFixture({
     *     expansions: ['drow', 'undead'],
     *     dennis: {
     *       hand: ['Ghost', 'House Guard'],
     *       influence: 3,
     *     },
     *     devoured: ['Flesh Golem'],
     *     'Chasmleap Bridge': {
     *       spies: ['dennis']
     *     },
     *   })

     *   const request1 = game.run()
     *   const request2 = t.choose(game, request1, 'Play Card.Ghost')
     *   const request3 = t.choose(game, request2, 'Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market')
     *   const request4 = t.choose(game, request3, 'Chasmleap Bridge')
     *   const request5 = t.choose(game, request4, 'Recruit.devoured: Flesh Golem')

     *   t.testBoard(game, {
     *     dennis: {
     *       hand: ['House Guard'],
     *       played: ['Ghost'],
     *       discard: ['Flesh Golem'],
     *     },
     *   })
     * }) */
  })

  describe('High Priest of Myrkul', () => {
    test('return and then promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['High Priest of Myrkul'],
          played: ['Ghost', 'Banshee', 'House Guard'],
        },
        'Ched Nasad': {
          spies: ['micah'],
        },
        'ched-llace a': {
          troops: ['micah']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.High Priest of Myrkul')
      const request3 = t.choose(game, request2, "Return another player's troop or spy")
      const request4 = t.choose(game, request3, 'spy.Ched Nasad, micah')
      const request5 = t.choose(game, request4, 'Ghost', 'Banshee')

      t.testBoard(game, {
        dennis: {
          discard: ['House Guard', 'High Priest of Myrkul'],
          innerCircle: ['Ghost', 'Banshee']
        },
        'Ched Nasad': {
          troops: ['dennis'],
          spies: [],
        },
        'ched-llace a': {
          troops: ['micah']
        },
      })
    })

    test('return and then promote; cannot promote non-undead', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['High Priest of Myrkul'],
          played: ['Ghost', 'Banshee', 'House Guard'],
        },
        'Ched Nasad': {
          spies: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.High Priest of Myrkul')
      const request3 = t.choose(game, request2, "Return another player's troop or spy")
      const request4 = t.choose(game, request3, 'spy.Ched Nasad, micah')

      const nextRequest = () => t.choose(game, request4, 'House Guard')

      expect(nextRequest).toThrow()
    })

    test('undead cascade', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        marketDeck: [
          'Lich',
          'Doppelganger',
          'Bounty Hunter',
          'Necromancer',
          'Ogre Zombie',
        ],
        dennis: {
          hand: ['High Priest of Myrkul'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.High Priest of Myrkul')
      const request3 = t.choose(game, request2, 'Undead cascade 4')
      const request4 = t.choose(game, request3, "Blingdenstone, neutral")
      const request5 = t.choose(game, request4, 'yes')

      t.testBoard(game, {
        dennis: {
          discard: ['Ogre Zombie', 'High Priest of Myrkul'],
          trophyHall: ['neutral'],
        },
      })
    })

    test('undead cascade: cannot acquire devoured cards', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        marketDeck: [
          'Lich',
          'Doppelganger',
          'Bounty Hunter',
          'Necromancer',
          'Skeletal Horde',
        ],
        dennis: {
          hand: ['High Priest of Myrkul'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.High Priest of Myrkul')
      const request3 = t.choose(game, request2, 'Undead cascade 4')
      const request4 = t.choose(game, request3, 'ched-halls a')
      const request5 = t.choose(game, request4, 'ched-halls b')
      const request6 = t.choose(game, request5, 'yes')
      const request7 = t.choose(game, request6, 'Halls of the Scoured Legion')
      const request8 = t.choose(game, request7, 'ever-halls')
      const request9 = t.choose(game, request8, 'Everfire')

      t.testBoard(game, {
        dennis: {
          discard: ['High Priest of Myrkul'],
        },
      })
    })
  })

  describe('Lich', () => {
    test('place a spy and then reanimate troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Lich', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral', 'neutral', 'dennis', 'dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Lich')
      const request3 = t.choose(game, request2, 'Eryndlyn')
      const request4 = t.choose(game, request3, 'dennis', 'dennis')
      const request5 = t.choose(game, request4, 'Ched Nasad')
      const request6 = t.choose(game, request5, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Lich'],
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          trophyHall: ['neutral', 'neutral'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })

    test('cannot reanimate if no enemy troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Lich', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral', 'neutral', 'dennis', 'dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Lich')
      const request3 = t.choose(game, request2, 'Menzoberranzan')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Lich', 'House Guard'],
          power: 2,
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          trophyHall: ['neutral', 'neutral', 'troop-dennis', 'troop-dennis'],
        },
        'Ched Nasad': {
          troops: ['dennis'],
        },
      })
    })
  })

  describe('Minotaur Skeleton', () => {
    test('deploy 3 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Minotaur Skeleton', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral', 'neutral', 'dennis', 'dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Minotaur Skeleton')
      const request3 = t.choose(game, request2, 'Deploy 3 troops')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'Ched Nasad')
      const request6 = t.choose(game, request5, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Minotaur Skeleton'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis', 'dennis'],
        },
      })
    })

    test('devour to assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Minotaur Skeleton', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral', 'neutral', 'dennis', 'dennis']
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'neutral', 'micah'],
          spies: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Minotaur Skeleton')
      const request3 = t.choose(game, request2, 'Devour this card > Assassinate up to three white troops at a single site')
      const request4 = t.choose(game, request3, 'Menzoberranzan')
      const request5 = t.choose(game, request4, 'neutral', 'neutral', 'neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          trophyHall: ['neutral', 'neutral', 'neutral'],
        },
        Menzoberranzan: {
          troops: ['micah'],
          spies: ['dennis'],
        },
        devoured: ['Minotaur Skeleton'],
      })
    })
  })

  describe('Mummy Lord', () => {
    test('choose two times', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Mummy Lord', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral', 'neutral', 'dennis', 'dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Mummy Lord')
      const request3 = t.choose(game, request2, 'Assassinate a white troop')
      const request4 = t.choose(game, request3, 'Take a white troop from any trophy hall and deploy it anywhere on the board')
      const request5 = t.choose(game, request4, 'micah')
      const request6 = t.choose(game, request5, 'Eryndlyn')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Mummy Lord'],
          trophyHall: ['neutral'],
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          trophyHall: ['neutral', 'troop-dennis', 'troop-dennis'],
        },
        Eryndlyn: {
          troops: ['micah', 'neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Necromancer', () => {
    test('choose two times', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Necromancer', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Necromancer')
      const request3 = t.choose(game, request2, '+3 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Necromancer'],
          influence: 3,
        },
      })
    })

    test('promote this card', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Necromancer', 'House Guard'],
          discard: ['Priestess of Lolth'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Necromancer')
      const request3 = t.choose(game, request2, 'Promote this card, or a card from your hand or discard pile')
      const request4 = t.choose(game, request3, 'this card.Necromancer')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          discard: ['Priestess of Lolth'],
          innerCircle: ['Necromancer'],
        },
      })
    })

    test('promote from hand', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Necromancer', 'House Guard', 'Spellspinner'],
          discard: ['Priestess of Lolth'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Necromancer')
      const request3 = t.choose(game, request2, 'Promote this card, or a card from your hand or discard pile')
      const request4 = t.choose(game, request3, 'hand.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Spellspinner'],
          innerCircle: ['House Guard'],
          discard: ['Priestess of Lolth'],
          played: ['Necromancer'],
        },
      })
    })

    test('promote from discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Necromancer', 'House Guard'],
          discard: ['Priestess of Lolth'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Necromancer')
      const request3 = t.choose(game, request2, 'Promote this card, or a card from your hand or discard pile')
      const request4 = t.choose(game, request3, 'discard.Priestess of Lolth')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          innerCircle: ['Priestess of Lolth'],
          played: ['Necromancer'],
        },
      })
    })
  })

  describe('Ogre Zombie', () => {
    test('Supplant a white troop anywhere on the board', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Ogre Zombie', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ogre Zombie')
      const request3 = t.choose(game, request2, 'Araumycos, neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ogre Zombie'],
          trophyHall: ['neutral'],
        },
        Araumycos: {
          troops: ['neutral', 'neutral', 'neutral', 'dennis'],
        },
      })
    })
  })

  describe('Ravenous Zombies', () => {
    test('power and assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Ravenous Zombies', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ravenous Zombies')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ravenous Zombies'],
          trophyHall: ['neutral'],
          power: 1,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Revenant', () => {
    test('Assassinate, but no promotion', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Revenant', 'House Guard'],
          trophyHall: ['micah', 'micah', 'micah', 'micah', 'micah'],
        },
        'ched-llace a': {
          troops: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Revenant')
      const request3 = t.choose(game, request2, 'ched-llace a, micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Revenant'],
          trophyHall: ['neutral', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah'],
        },
        'araum-ched': {
          troops: [],
        },
        'ched-llace a': {
          troops: [],
        },
      })
    })

    test('Assassinate and promotion', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Revenant', 'House Guard'],
          trophyHall: ['micah', 'micah', 'micah', 'micah', 'micah', 'micah'],
        },
        'ched-llace a': {
          troops: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Revenant')
      const request3 = t.choose(game, request2, 'ched-llace a, micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          innerCircle: ['Revenant'],
          trophyHall: ['neutral', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'troop-micah'],
        },
        'araum-ched': {
          troops: [],
        },
        'ched-llace a': {
          troops: [],
        },
      })
    })
  })

  describe('Skeletal Horde', () => {
    test('place troops; no devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Skeletal Horde', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Skeletal Horde')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'ched-llace b')
      const request5 = t.choose(game, request4, 'no')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Skeletal Horde'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'ched-llace b': {
          troops: ['dennis'],
        },
      })
    })

    test('place troops and devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Skeletal Horde', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Skeletal Horde')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'ched-llace b')
      const request5 = t.choose(game, request4, 'yes')
      const request6 = t.choose(game, request5, 'Ched Nasad')
      const request7 = t.choose(game, request6, 'Ched Nasad')
      const request8 = t.choose(game, request7, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis', 'dennis'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'ched-llace b': {
          troops: ['dennis'],
        },
        devoured: ['Skeletal Horde'],
      })
    })
  })

  describe('Vampire Spawn', () => {
    test('place troops; no devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Vampire Spawn', 'House Guard'],
        },
        'ched-llace a': {
          troop: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vampire Spawn')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vampire Spawn'],
          influence: 1,
        },
        'ched-llace a': {
          troops: [],
        },
      })
    })
  })

  describe('Vampire', () => {
    test('supplant', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Vampire', 'House Guard'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vampire')
      const request3 = t.choose(game, request2, 'Supplant a troop')
      const request4 = t.choose(game, request3, 'ched-llace a, micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vampire'],
          trophyHall: ['troop-micah'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
      })
    })

    test('promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Vampire', 'House Guard'],
          discard: ['Spellspinner'],
          innerCircle: ['House Guard', 'House Guard'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vampire')
      const request3 = t.choose(game, request2, 'Promote a card from your discard pile, then gain 1 VP for every 3 cards in your inner circle')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vampire'],
          innerCircle: ['House Guard', 'House Guard', 'Spellspinner'],
          points: 1,
        },
      })
    })
  })

  describe('Wight', () => {
    test('+2 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Wight', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Wight')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Wight'],
          power: 2,
        },
      })
    })

    test('devour to supplant', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Wight', 'House Guard', 'Spellspinner'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Wight')
      const request3 = t.choose(game, request2, 'Devour a card in your hand > Supplant a troop')
      const request4 = t.choose(game, request3, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Spellspinner'],
          played: ['Wight'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: ['dennis'],
        },
        devoured: ['House Guard'],
      })
    })
  })

  describe('Wraith', () => {
    test('spy, no devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Wraith', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Wraith')
      const request3 = t.choose(game, request2, 'Eryndlyn')
      const request4 = t.choose(game, request3, 'no')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Wraith'],
        },
        Eryndlyn: {
          spies: ['dennis'],
          troops: ['micah'],
        }
      })
    })

    test('spy with devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Wraith', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Wraith')
      const request3 = t.choose(game, request2, 'Eryndlyn')
      const request4 = t.choose(game, request3, 'yes')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          trophyHall: ['troop-micah'],
        },
        Eryndlyn: {
          spies: ['dennis'],
          troops: [],
        },
        devoured: ['Wraith'],
      })
    })
  })

})
