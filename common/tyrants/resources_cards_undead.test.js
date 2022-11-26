Error.stackTraceLimit = 100

const t = require('./testutil.js')


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
    test('place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Conjurer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Conjurer')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Conjurer'],
        },
        'Chasmleap Bridge': {
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

})
