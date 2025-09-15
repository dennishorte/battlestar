Error.stackTraceLimit = 100

const t = require('../../testutil.js')


describe('Elementals expansion', () => {

  describe('Eternal Flame Cultist', () => {
    test('assassinate a troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Eternal Flame Cultist'],
          trophyHall: ['neutral'],
          power: 0,
        },
        'araum-ched': {
          troops: [],
        },
      })

    })

    test('Malice Focus > +2 power (in hand)', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Eternal Flame Cultist'],
          trophyHall: ['neutral'],
          power: 2,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('Malice Focus > +2 power (played)', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'Fire Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Eternal Flame Cultist', 'Fire Elemental Myrmidon'],
          trophyHall: ['neutral'],
          power: 4,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Fire Elemental', () => {
    test('Choose: +2 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Fire Elemental'],
          power: 2,
        },
      })
    })

    test('Choose: +2 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Fire Elemental'],
          influence: 2,
        },
      })
    })

    test('Malice Focus > draw a card', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental', 'Soldier',],
          played: ['Fire Elemental'],
          influence: 2,
        },
      })
    })
  })

  describe('Fire Elemental Myrmidon', () => {
    test('+2 power, no promo', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon'],
        },
      })
    })

    test('+2 power, promote obdience', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test('+2 power, cannot promote malice', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon', 'Eternal Flame Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.Eternal Flame Cultist')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon', 'Eternal Flame Cultist'],
          trophyHall: ['neutral'],
        },
      })
    })
  })

  describe('Vanifer', () => {
    test('assassinate a troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Vanifer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vanifer')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vanifer'],
          trophyHall: ['neutral'],
          power: 0,
        },
        'araum-ched': {
          troops: [],
        },
      })

    })

    test('Recruit a Malice card that costs 4 or less without paying its cost', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Vanifer', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vanifer')
      const request3 = t.choose(game, request2, 'Blackguard')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Vanifer'],
          discard: ['Blackguard'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Imix', () => {
    test('+4 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Imix', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Imix')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Imix'],
          power: 4,
        },
      })

    })

    test('Malice Focus > +2 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Imix', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Imix')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Imix'],
          power: 6
        },
      })
    })
  })

  describe('Crushing Wave Cultist', () => {
    test('Assassinate a white troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Crushing Wave Cultist', 'House Guard'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Crushing Wave Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Crushing Wave Cultist'],
          trophyHall: ['neutral'],
        },
      })

    })

    test('Conquest Focus > Deploy 2 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Crushing Wave Cultist', 'Advance Scout'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Crushing Wave Cultist')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout'],
          played: ['Crushing Wave Cultist'],
          trophyHall: ['neutral'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

  describe('Water Elemental', () => {
    test('Assassinate a white troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Water Elemental'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })

    })

    test('Conquest Focus > Deploy 2 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental', 'Advance Scout'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout', 'Soldier'],
          played: ['Water Elemental'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

  describe('Water Elemental Myrmidon', () => {
    test('Assassinate a white troop, no promo', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Water Elemental Myrmidon'],
          trophyHall: ['neutral'],
        },
      })
    })

    test('Assassinate a white troop, promote obdience', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental Myrmidon', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Water Elemental Myrmidon'],
          innerCircle: ['House Guard'],
          trophyHall: ['neutral'],
        },
      })
    })

    test('Assassinate a white troop, cannot promote malice', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental Myrmidon', 'Eternal Flame Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.Eternal Flame Cultist')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Water Elemental Myrmidon', 'Eternal Flame Cultist'],
          trophyHall: ['neutral'],
        },
      })
    })
  })

  describe('Gar Shatterkeel', () => {
    test('deploy 3 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Gar Shatterkeel', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gar Shatterkeel')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Gar Shatterkeel'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis', 'dennis'],
        },
      })

    })

    test.skip('Recruit a Malice card that costs 4 or less without paying its cost', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Gar Shatterkeel', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gar Shatterkeel')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Gar Shatterkeel'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

  describe('Olhydra', () => {
    test('supplant a white troop anywhere on the board', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Olhydra', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Olhydra')
      const request3 = t.choose(game, request2, 'Blingdenstone, neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Olhydra'],
          trophyHall: ['neutral'],
        },
        Blingdenstone: {
          troops: ['neutral', 'dennis'],
        },
      })

    })

    test('Conquest Focus > Deploy 2 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Olhydra', 'Advance Scout'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Olhydra')
      const request3 = t.choose(game, request2, 'Blingdenstone, neutral')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout'],
          played: ['Olhydra'],
          trophyHall: ['neutral'],
        },
        Blingdenstone: {
          troops: ['neutral', 'dennis'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

  describe('Air Elemental', () => {
    test('choose: place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Air Elemental', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Air Elemental')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Air Elemental'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })
    })

    test('choose: return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Air Elemental', 'Advance Scout'],
        },
        Everfire: {
          spies: ['dennis']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Air Elemental')
      const request3 = t.choose(game, request2, 'Return one of your spies > Deploy 3 troops')
      const request4 = t.choose(game, request3, 'Everfire')
      const request5 = t.choose(game, request4, 'Ched Nasad')
      const request6 = t.choose(game, request5, 'Ched Nasad')
      const request7 = t.choose(game, request6, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout'],
          played: ['Air Elemental'],
        },
        Everfire: {
          troops: [],
          spies: [],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis', 'dennis'],
        },
      })
    })

    test('guile focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Air Elemental', 'Spellspinner'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Air Elemental')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['Spellspinner', 'Soldier'],
          played: ['Air Elemental'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })
    })
  })

  describe('Howling Hatred Cultist', () => {
    test('choose: place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Howling Hatred Cultist', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Howling Hatred Cultist')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Howling Hatred Cultist'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })
    })

    test('choose: return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Howling Hatred Cultist', 'Advance Scout'],
        },
        Everfire: {
          spies: ['dennis']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Howling Hatred Cultist')
      const request3 = t.choose(game, request2, 'Return one of your spies > +3 influence')
      const request4 = t.choose(game, request3, 'Everfire')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout'],
          played: ['Howling Hatred Cultist'],
          influence: 3,
        },
        Everfire: {
          troops: [],
          spies: [],
        },
      })
    })

    test('guile focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Howling Hatred Cultist', 'Spellspinner'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Howling Hatred Cultist')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['Spellspinner'],
          played: ['Howling Hatred Cultist'],
          power: 1,
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })
    })
  })

  describe('Air Elemental Myrmidon', () => {
    test('place a spy; no promo', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Air Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Air Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Everfire')

      t.testBoard(game, {
        dennis: {
          discard: ['Air Elemental Myrmidon'],
        },
        Everfire: {
          spies: ['dennis'],
        },
      })
    })

    test('Place a spy, promote obdience', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Air Elemental Myrmidon', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Air Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Everfire')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')
      const request5 = t.choose(game, request4, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Air Elemental Myrmidon'],
          innerCircle: ['House Guard'],
        },
        Everfire: {
          spies: ['dennis'],
        },
      })
    })
  })

  describe('Aerisi Kalinoth', () => {
    test('All the things', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Aerisi Kalinoth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Aerisi Kalinoth')
      const request3 = t.choose(game, request2, 'Everfire')
      const request4 = t.choose(game, request3, 'Spellspinner')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Aerisi Kalinoth'],
          discard: ['Spellspinner'],
          power: 1,
        },
        Everfire: {
          spies: ['dennis'],
        },
      })
    })
  })

  describe('Yan-C-Bin', () => {
    test('Place a spy, no focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Yan-C-Bin', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Yan-C-Bin')
      const request3 = t.choose(game, request2, 'Skullport')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Yan-C-Bin', 'House Guard'],
          trophyHall: ['neutral'],
          power: 2,
        },
        Skullport: {
          spies: ['dennis'],
          troops: ['neutral'],
        },
      })
    })

    test('Place a spy, with focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Yan-C-Bin', 'Spellspinner'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Yan-C-Bin')
      const request3 = t.choose(game, request2, 'Skullport')
      const request4 = t.choose(game, request3, 'Everfire')
      const request5 = t.choose(game, request4, 'Play Card.Spellspinner')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Yan-C-Bin', 'Spellspinner'],
          trophyHall: ['neutral'],
        },
        Everfire: {
          spies: ['dennis'],
        },
        Skullport: {
          spies: ['dennis'],
          troops: ['neutral'],
        },
      })
    })
  })

  describe('Black Earth Cultist', () => {
    test('Promotion', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Black Earth Cultist', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Black Earth Cultist')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Black Earth Cultist'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test('Ambition Focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Black Earth Cultist', 'Council Member'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Black Earth Cultist')
      const request3 = t.choose(game, request2, 'Play Card.Council Member')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Black Earth Cultist', 'Council Member'],
          influence: 2,
        },
      })
    })
  })

  describe('Earth Elemental', () => {
    test('Influence plus return', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Earth Elemental', 'House Guard'],
        },
        'Everfire': {
          troops: ['dennis'],
          spies: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Earth Elemental')
      const request3 = t.choose(game, request2, 'spy.Everfire, micah')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Earth Elemental', 'House Guard'],
          influence: 1,
          power: 2,
        },
        'Everfire': {
          troops: ['dennis']
        },
      })
    })

    test('Ambition Focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Earth Elemental', 'House Guard', 'Council Member'],
        },
        'Everfire': {
          troops: ['dennis'],
          spies: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Earth Elemental')
      const request3 = t.choose(game, request2, 'spy.Everfire, micah')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Soldier', 'Council Member'],
          played: ['Earth Elemental', 'House Guard'],
          influence: 1,
          power: 2,
        },
        'Everfire': {
          troops: ['dennis']
        },
      })
    })
  })

  describe('Earth Elemental Myrmidon', () => {
    test('Influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Earth Elemental Myrmidon', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Earth Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Earth Elemental Myrmidon', 'House Guard'],
          influence: 2,
          power: 2,
        },
      })
    })

    test('Promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Earth Elemental Myrmidon', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Earth Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Earth Elemental Myrmidon'],
          innerCircle: ['House Guard'],
        },
      })
    })
  })

  describe('Marlos Urnrayle', () => {
    test('Promote and recruit', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Marlos Urnrayle', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Marlos Urnrayle')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Marlos Urnrayle', 'Advocate'],
          innerCircle: ['House Guard'],
        },
      })
    })
  })

  describe('Ogremoch', () => {
    test('Influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Ogremoch', 'House Guard'],
        },
      })

      // TODO: Put an ambition card in the market to buy

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ogremoch')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Ogremoch', 'House Guard'],
          influence: 2,
          power: 2,
        },
      })
    })

    test('Promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Ogremoch', 'House Guard'],
        },
      })

      // TODO: Put an ambition card in the market to buy

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ogremoch')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Ogremoch'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test('Ambition Focus', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Ogremoch', 'House Guard', 'House Guard', 'Council Member'],
        },
      })

      // TODO: Put an ambition card in the market to buy

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ogremoch')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Play Card.House Guard')
      const request5 = t.choose(game, request4, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Ogremoch', 'Council Member'],
          innerCircle: ['House Guard', 'House Guard'],
        },
      })
    })
  })
})
